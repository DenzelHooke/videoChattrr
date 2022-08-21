import "../styles/globals.css";
// import "../styles/Index.css";
import "../styles/Forms.scss";
import Layout from "../components/Layout";
import { store } from "../app/store";
import { Provider } from "react-redux";
import AppContext from "../states/AppContext";
import authObject from "../states/auth/authObject";
import "react-toastify/dist/ReactToastify.css";
import { wrapper } from "../app/store";
// import "bootstrap/dist/css/bootstrap.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

  //Context API
  // const authorizationObject = authObject;
  // return (
  //     <AppContext.Provider value={
  //       {
  //         state: {
  //           auth: authorizationObject,
  //         }
  //       }
  //     }>
  //       <Layout>
  //         <Component {...pageProps} />
  //       </Layout>
  //     </AppContext.Provider>
  // );
}

export default wrapper.withRedux(MyApp);
