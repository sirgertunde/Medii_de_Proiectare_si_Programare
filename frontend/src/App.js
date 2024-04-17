import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import AddBook from './AddBook';
import AddReview from './AddReview';
import ListBooksAndReviews from './ListBooksAndReviews';
import EditBook from './EditBook';
import EditReview from './EditReview';
import ViewBook from './ViewBook';
import ViewReview from './ViewReview';
import { isOnlineReviews } from './OfflineUtils';

function App() {
  useEffect(() => {
    const handleNetworkStatus = () => {
      isOnlineReviews();
    };

    handleNetworkStatus();
  });

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<ListBooksAndReviews/>}></Route>
          <Route exact path="/addBook" element={<AddBook/>}></Route>
          <Route exact path="/addReview" element={<AddReview/>}></Route>
          <Route exact path="/editBook/:id" element={<EditBook />} />
          <Route exact path="/editReview/:id" element={<EditReview />} />
          <Route exact path="/viewBook/:id" element ={<ViewBook/>}></Route>
          <Route exact path="/viewReview/:id" element ={<ViewReview/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
