<<<<<<< HEAD
import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
=======
import "bootstrap/dist/css/bootstrap.min.css";
//import 'bootstrap-icons/font/bootstrap-icons.min.css';
>>>>>>> 2b92ec9511258583ddead81424ee8f7cc170dcf8
import "@/styles/globals.css";

import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}