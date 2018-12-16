import React from 'react';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';

// import css from './index.css';

class Page extends React.Component {
  render = () =>
    <main className={`css.main`}>
      <Header/>

      <div className="container">
      </div>

      <Footer/>
    </main>
}

export default Page;
