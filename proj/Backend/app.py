

import datetime
import bcrypt
from flask_bcrypt import Bcrypt
from flask import Flask, abort,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func 
from flask_cors import CORS
from flask_marshmallow import Marshmallow
import jwt
from db_config import DB_CONFIG

import statistics

SECRET_KEY = "b'|\xe7\xbfU3`\xc4\xec\xa7\xa9zf:}\xb5\xc7\xb9\x139^3@Dv'"

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONFIG


CORS(app)
ma = Marshmallow(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

from .model.user import User, UserSchema
from .model.transaction import Transaction ,TransactionSchema
from .model.request import Request ,RequestSchema

@app.route("/Transaction", methods=['POST'])
def CreateTransacation():
    body = request.get_json()
    token = extract_auth_token(request)
    user_id = None
    transaction =None

    if(token != None):
        try:
            user_id = decode_token(token)

        except jwt.ExpiredSignatureError :
            return jsonify({"error": "Authentication token has expired"}), 403
        except  jwt.InvalidTokenError:
            return jsonify({"error": "Invalid authentication token"}), 403

    transaction = Transaction(body['usd_amount'],body['lbp_amount'],body['usd_to_lbp'],user_id) 
    db.session.add(transaction)
    db.session.commit()
    transaction_schema = TransactionSchema()
    return jsonify(transaction_schema.dump(transaction))


@app.route('/Transaction',methods=['GET'])
def getalltranscations():
    token = extract_auth_token(request)
    user_id = None
    transaction =None
    if(token != None):
        try:
            user_id = decode_token(token)
        except jwt.ExpiredSignatureError :
            return jsonify({"error": "Authentication token has expired"}), 403
        except  jwt.InvalidTokenError:
            return jsonify({"error": "Invalid authentication token"}), 403
    transactions = db.session.query(Transaction).filter_by(user_id=user_id).all()
    db.session.query()
    db.session.commit()
    transaction_schema = TransactionSchema(many=True)
    return jsonify(transaction_schema.dump(transactions))

@app.route("/user", methods=['POST'])
def signup():
    body = request.get_json()
    print(body)
    user = User(body['user_name'],body['password'])
    db.session.add(user)
    db.session.commit()
    user_schema = UserSchema()
    return jsonify(user_schema.dump(user))

@app.route("/exchangeRate", methods=['GET'])
def GetExchangeRate():
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=3)

    usd_to_lbp_transactions = Transaction.query.filter(
        Transaction.added_date.between(start_date, end_date),
        Transaction.usd_to_lbp == True).all()
    lbp_to_usd_transactions = Transaction.query.filter(
        Transaction.added_date.between(start_date, end_date),
        Transaction.usd_to_lbp == False).all()
    
    total_usd_to_lbp = sum(transaction.lbp_amount / transaction.usd_amount for transaction in usd_to_lbp_transactions)
    total_lbp_to_usd = sum(transaction.usd_amount / transaction.lbp_amount for transaction in lbp_to_usd_transactions)

    num_usd_to_lbp = len(usd_to_lbp_transactions)
    num_lbp_to_usd = len(lbp_to_usd_transactions)

    avg_usd_to_lbp = total_usd_to_lbp / num_usd_to_lbp if num_usd_to_lbp > 0 else 0
    avg_lbp_to_usd = total_lbp_to_usd / num_lbp_to_usd if num_lbp_to_usd > 0 else 0

    response = {
        "usd_to_lbp": avg_usd_to_lbp,
        "lbp_to_usd": avg_lbp_to_usd
    }

    return jsonify(response) 


@app.route("/authentication", methods=['POST'])
def login():
    body = request.get_json()
    if not request.json or 'user_name' not in request.json or 'password' not in request.json:
        abort(400)        
    user_name = request.json['user_name']
    password = request.json['password']

    user = db.session.query(User).filter_by(user_name=user_name).first()
    if not user or not bcrypt.check_password_hash(user.hashed_password, password) :
        abort(403)
    else : 
        token = {'token': create_token(user.id),"userid":user.id}
        return  jsonify(token)


def create_token(user_id):
    payload = {
    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=4),
    'iat': datetime.datetime.utcnow(),
    'sub': user_id
    }
    return jwt.encode(
    payload,
    SECRET_KEY,
    algorithm='HS256'
 )

def extract_auth_token(authenticated_request):
    auth_header = authenticated_request.headers.get('Authorization')
    if auth_header:
        return auth_header.split(" ")[1]
    else:
        return None
def decode_token(token):
    payload = jwt.decode(token, SECRET_KEY, 'HS256')
    return payload['sub']



@app.route('/exchange_rate', methods=['GET'])
def get_exchange_rate():
    data = []

    last_transaction = Transaction.query.order_by(Transaction.added_date.desc()).first()
    if last_transaction:
        end_date = last_transaction.added_date.date() # Last available transaction date
        start_date = end_date - datetime.timedelta(days=6) # Last 7 days from last available transaction date
    else:
        end_date = datetime.datetime.now().date() # Current date as fallback
        start_date = end_date - datetime.timedelta(days=6) # Last 7 days from current date as fallback

    for i in range(7):
        date = start_date + datetime.timedelta(days=i)
        transactions = Transaction.query.filter(func.date(Transaction.added_date) == date).all()
        buy_usd_total = sum(transaction.usd_amount for transaction in transactions if transaction.usd_to_lbp)
        buy_usd_count = len([transaction for transaction in transactions if transaction.usd_to_lbp])
        sell_usd_total = sum(transaction.usd_amount for transaction in transactions if not transaction.usd_to_lbp)
        sell_usd_count = len([transaction for transaction in transactions if not transaction.usd_to_lbp])

        data.append({
            'Month': date.strftime('%b %d'),
            'Buy usd': buy_usd_total / buy_usd_count if buy_usd_count > 0 else 0,
            'Sell usd': sell_usd_total / sell_usd_count if sell_usd_count > 0 else 0})

    return jsonify(data)





@app.route('/sentrequests/<userid>', methods=['GET'])
def get_sentrequests(userid):
    try:
        sentrequests = Request.query.filter_by(sender_id=userid).all()
        sentrequests_list = []
        for request in sentrequests:
            user = User.query.filter_by(id=request.receiver_id).first()
            request_dict = {
                'id': request.id,
                'sender_id': request.sender_id,
                'receiver_id': request.receiver_id,
                'recievername': user.user_name,
                'usd_amount' : request.usd_amount,
                'lbp_amount' : request.lbp_amount,
                'usd_to_lbp':request.usd_to_lbp,
                'status' : request.status
            }
            sentrequests_list.append(request_dict)
        return jsonify(sentrequests_list)
    except Exception as ex:
        print(str(ex))
        return jsonify({'error': 'Failed to retrieve requests'}), 500









@app.route('/recievedrequests/<userid>', methods=['GET'])
def get_received_requests(userid):
    try:
        sent_requests = Request.query.filter_by(receiver_id=userid).all()
        sent_requests_list = []
        for request in sent_requests:
            user = User.query.filter_by(id=request.sender_id).first()
            request_dict = {
                'id': request.id,
                'sender_id': request.sender_id,
                'receiver_id': request.receiver_id,
                'sendername': user.user_name,
                'usd_amount' : request.usd_amount,
                'lbp_amount' : request.lbp_amount,
                'usd_to_lbp': request.usd_to_lbp,
                'status' : request.status
            }
            sent_requests_list.append(request_dict)
        return jsonify(sent_requests_list)
    except Exception as ex:
        print(str(ex))
        return jsonify({'error': 'Failed to retrieve requests'}), 500





@app.route('/reject_request/<request_id>', methods=['PUT'])
def reject_request(request_id):
    request = Request.query.get(request_id)

    if request:
        request.status = "Rejected"
        try:
            db.session.commit()
            return "rejected", 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Request not found'}), 404



@app.route('/accept_request/<request_id>', methods=['PUT'])
def accept_request(request_id):
    request = Request.query.get(request_id)
    
    transaction = Transaction(request.usd_amount,request.lbp_amount,request.usd_to_lbp,request.sender_id) 
    db.session.add(transaction)
    db.session.commit()
    transaction_schema = TransactionSchema()

    if request:
        request.status = "Accepted"
        try:
            db.session.commit()
            return " accepted", 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Request not found'}), 404









@app.route('/send_request', methods=['POST'])
def send_request():
    sender_id = request.json['sender_id']
    recieverusername = request.json['recieverusername']
    user = db.session.query(User).filter_by(user_name=recieverusername).first()
    usd_amount = request.json['usd_amount']
    lbp_amount = request.json['lbp_amount']
    usd_to_lbp =   bool(request.json['usd_to_lbp'])
    status = "Pending"  
    new_request = Request(sender_id, user.id, usd_amount,lbp_amount, usd_to_lbp, status)

    try:
        db.session.add(new_request)
        db.session.commit()
        return "the request is sent", 201
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({'error': str(e)}), 500






@app.route('/cancel_request/<request_id>', methods=['PUT'])
def cancel_request(request_id):
    request = Request.query.get(request_id)

    if request:
        request.status = "Canceled"
        try:
            db.session.commit()
            return "the transcation is done", 200
        except Exception as e:
            print(str(e))
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Request not found'}), 404





@app.route('/exchange_rate_statistics', methods=['GET'])
def exchange_rate_statistics():
    # Query the database for relevant transaction data
    transactions = Transaction.query.all()
    usd_amounts = []
    lbp_amounts = []
    for transaction in transactions:
        if transaction.usd_to_lbp:
            usd_amounts.append(transaction.usd_amount)
        else:
            lbp_amounts.append(transaction.lbp_amount)

    sell_std = None
    buy_std = None
    sell_mode = None
    buy_mode = None
    sell_median = None
    buy_median = None
    sell_max = None
    buy_max = None
    sell_min = None
    buy_min = None
    number_of_buys = len(usd_amounts)
    number_of_sells = len(lbp_amounts)
    increase = None

    if usd_amounts:
        sell_std = round(float(max(usd_amounts)), 2)
        buy_std = round(float(min(usd_amounts)), 2)
        sell_mode = round(float(max(set(usd_amounts), key=usd_amounts.count)), 2)
        buy_mode = round(float(min(set(usd_amounts), key=usd_amounts.count)), 2)
        sell_median = round(float(sorted(usd_amounts)[len(usd_amounts) // 2]), 2)
        buy_median = round(float(sorted(usd_amounts)[len(usd_amounts) // 2]), 2)
        sell_max = round(float(max(usd_amounts)), 2)
        buy_max = round(float(min(usd_amounts)), 2)
        sell_min = round(float(min(usd_amounts)), 2)
        buy_min = round(float(max(usd_amounts)), 2)

    if usd_amounts and lbp_amounts:
        increase = round(((sum(usd_amounts) - sum(lbp_amounts)) / sum(lbp_amounts)) * 100, 2)

    # Create response JSON
    response = {

    "sell_std": sell_std,
    "buystd": buy_std,
    "sellmode": sell_mode,
    "buymode": buy_mode,
    "sellmedian": sell_median,
    "buymedian": buy_median,
    "sellmax": sell_max,
    "buymax": buy_max,
    "sellmin": sell_min,
    "buymin": buy_min,
    "numberofbuys": number_of_buys,
    "numberofsells": number_of_sells,
    "increase": increase

    }


    return jsonify(response), 200








if __name__  == "__main__" :
    app.run(host="0.0.0.0",port=5000,debug=True,)
