import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./layout";

export default function App({ Component, pageProps }: any) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
