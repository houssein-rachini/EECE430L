package com.houssein_rachini.exchange.rates;

import com.houssein_rachini.exchange.Authentication;
import com.houssein_rachini.exchange.api.ExchangeService;
import com.houssein_rachini.exchange.api.model.ExchangeRates;
import com.houssein_rachini.exchange.api.model.Transaction;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.scene.control.*;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Rates {
    public Label buyUsdRateLabel;
    public Label sellUsdRateLabel;
    public TextField lbpTextField;
    public TextField usdTextField;
    public ToggleGroup transactionType;

    public void initialize() {
        fetchRates();
    }

    private void fetchRates() {
        ExchangeService.exchangeApi().getExchangeRates().enqueue(new Callback<ExchangeRates>() {
            @Override
            public void onResponse(Call<ExchangeRates> call, Response<ExchangeRates> response) {
                ExchangeRates exchangeRates = response.body();
                Platform.runLater(() -> {
                    buyUsdRateLabel.setText(exchangeRates.lbpToUsd.toString());
                    sellUsdRateLabel.setText(exchangeRates.usdToLbp.toString());
                });
            }
            @Override
            public void onFailure(Call<ExchangeRates> call, Throwable throwable) {
            }
        });
    }




    public void addTransaction(ActionEvent actionEvent) {
        String usdInput = usdTextField.getText();
        String lbpInput = lbpTextField.getText();
        if (usdInput.isEmpty() || lbpInput.isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.ERROR, "Please enter values for both USD and LBP.");
            alert.showAndWait();
            return;
        }
        // Check if transaction type is selected
        if (transactionType.getSelectedToggle() == null) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setHeaderText("Input Error");
            alert.setContentText("Please select a transaction type.");
            alert.showAndWait();
            return;
        }
        Transaction transaction = new Transaction(
                Float.parseFloat(usdInput),
                Float.parseFloat(lbpInput),
                ((RadioButton) transactionType.getSelectedToggle()).getText().equals("Sell USD")
        );
        String userToken = Authentication.getInstance().getToken();
        String authHeader = userToken != null ? "Bearer " + userToken : null;
        ExchangeService.exchangeApi().addTransaction(transaction,authHeader).enqueue(new Callback<Object>() {
        @Override
            public void onResponse(Call<Object> call, Response<Object> response) {
                fetchRates();
                Platform.runLater(() -> {
                    usdTextField.setText("");
                    lbpTextField.setText("");
                });
            }

            @Override
            public void onFailure(Call<Object> call, Throwable throwable) {
            }
        });
    }
    public void calculateEquivalent(ActionEvent actionEvent) {
        String usdInput = usdTextField.getText();
        String lbpInput = lbpTextField.getText();
        if (usdInput.isEmpty() && lbpInput.isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.ERROR, "Please enter a value for either USD or LBP.");
            alert.showAndWait();
            return;
        }

        Float usdRate = Float.parseFloat(buyUsdRateLabel.getText());
        Float lbpRate = Float.parseFloat(sellUsdRateLabel.getText());

        if (!usdInput.isEmpty() && lbpInput.isEmpty()) {
            Float usdValue = Float.parseFloat(usdInput);
            Float lbpValue = usdValue * lbpRate;
            lbpTextField.setText(String.format("%.2f", lbpValue));
        }

        else if (usdInput.isEmpty() && !lbpInput.isEmpty()) {
            Float lbpValue = Float.parseFloat(lbpInput);
            Float usdValue = lbpValue / usdRate;
            usdTextField.setText(String.format("%.2f", usdValue));
        }
        else{
            Alert alert = new Alert(Alert.AlertType.ERROR, "Please enter one value only");
            alert.showAndWait();
            return;
        }
    }


}