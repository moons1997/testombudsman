import React from "react";
import { IntlProvider } from "react-intl";

import cyrl from "../../assets/data/locales/cyrl.json";
import latn from "../../assets/data/locales/latn.json";
import ru from "../../assets/data/locales/ru.json";
import AccountService from "../../services/account.service";
const menu_messages = {
  cl: cyrl,
  ln: latn,
  ru: ru,
};

const Context = React.createContext();

class IntlProviderWrapper extends React.Component {
  state = {
    locale: localStorage.getItem("locale") || "cl",
    messages: menu_messages[localStorage.getItem("locale") || "cl"],
    // locale: "",
  };
  componentDidMount() {
    // var lang = JSON.parse(localStorage.getItem("user_info"));
    // console.log("aaaaaaaaaa", lang?.languageId);
    // this.setState({
    //   locale:
    //     lang?.languageId != 3 ? "ln" : lang?.languageId == 2 ? "cl" : "ru",
    // });
    // console.log("aaaaaaaaaa", lang?.languageId);
  }
  render() {
    const { children } = this.props;
    const { locale, messages } = this.state;
    return (
      <Context.Provider
        value={{
          state: this.state,
          switchLanguage: (language) => {
            localStorage.setItem("locale", language);
            this.setState({
              locale: language,
              messages: menu_messages[language],
            });
          },
        }}
      >
        <IntlProvider
          key={locale}
          locale={locale}
          messages={messages}
          defaultLocale={localStorage.getItem("locale") || "cl"}
        >
          {children}
        </IntlProvider>
      </Context.Provider>
    );
  }
}

export { IntlProviderWrapper, Context as IntlContext };
