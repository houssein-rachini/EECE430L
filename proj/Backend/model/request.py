from ..app import db,ma
import datetime


class Request(db.Model):
    __tablename__ = 'Request'
    id = db.Column(db.Integer, primary_key=True, unique=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    usd_amount = db.Column(db.Float)
    lbp_amount = db.Column(db.Float)
    usd_to_lbp = db.Column(db.Boolean)
    status = db.Column(db.String(30))

    def __init__(self, sender_id, receiver_id, usd_amount,lbp_amount, usd_to_lbp, status):
        super(Request, self).__init__()
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.usd_amount = usd_amount
        self.lbp_amount = lbp_amount
        self.usd_to_lbp = usd_to_lbp
        self.status = status

class RequestSchema(ma.Schema):
    class Meta:
        fields = ("id", "sender_id", "receiver_id", "usd_amount","lbp_amount", "usd_to_lbp", "status")
        model = Request