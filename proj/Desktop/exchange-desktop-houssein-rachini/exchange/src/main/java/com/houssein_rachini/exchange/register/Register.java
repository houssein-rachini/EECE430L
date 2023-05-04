package com.houssein_rachini.exchange.register;

import com.houssein_rachini.exchange.Authentication;
import com.houssein_rachini.exchange.OnPageCompleteListener;
import com.houssein_rachini.exchange.PageCompleter;
import com.houssein_rachini.exchange.api.ExchangeService;
import com.houssein_rachini.exchange.api.model.Token;
import com.houssein_rachini.exchange.api.model.User;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.scene.control.TextField;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

    public class Register implements PageCompleter{
        public TextField usernameTextField;
        public TextField passwordTextField;
        private OnPageCompleteListener onPageCompleteListener;
        public void register(ActionEvent actionEvent) {
            User user = new User(usernameTextField.getText(),
                    passwordTextField.getText());
            ExchangeService.exchangeApi().addUser(user).enqueue(new
                                                                        Callback<User>() {
                                                                            @Override
                                                                            public void onResponse(Call<User> call, Response<User>
                                                                                    response) {

                                                                                ExchangeService.exchangeApi().authenticate(user).enqueue(new
                                                                                                                                                 Callback<Token>() {
                                                                                                                                                     @Override
                                                                                                                                                     public void onResponse(Call<Token> call,
                                                                                                                                                                            Response<Token> response) {

                                                                                                                                                         Authentication.getInstance().saveToken(response.body().getToken());
                                                                                                                                                     }
                                                                                                                                                     @Override
                                                                                                                                                     public void onFailure(Call<Token> call, Throwable
                                                                                                                                                             throwable) {
                                                                                                                                                     }
                                                                                                                                                 });
                                                                            }
                                                                            @Override
                                                                            public void onFailure(Call<User> call, Throwable throwable) {
                                                                            }
                                                                        });
        }

    public void setOnPageCompleteListener(OnPageCompleteListener onPageCompleteListener) {
        this.onPageCompleteListener = onPageCompleteListener;
    }
}
