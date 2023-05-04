module com.houssein_rachini.exchange {
    requires javafx.controls;
    requires javafx.fxml;
    requires retrofit2;
    requires java.sql;
    requires gson;
    requires retrofit2.converter.gson;
    requires java.prefs;
    opens com.houssein_rachini.exchange to javafx.fxml;
    opens com.houssein_rachini.exchange.api.model to javafx.base, gson;
    exports com.houssein_rachini.exchange;
    opens com.houssein_rachini.exchange.api to gson;
    exports com.houssein_rachini.exchange.rates;
    opens com.houssein_rachini.exchange.rates to javafx.fxml;
    opens com.houssein_rachini.exchange.login to javafx.fxml;
    opens com.houssein_rachini.exchange.register to javafx.fxml;
    opens com.houssein_rachini.exchange.transactions to javafx.fxml;
}
