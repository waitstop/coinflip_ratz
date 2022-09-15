import React from 'react';
import Wallet from "./components/Coinflip/wallet/Wallet";
import CoinflipGamePage from "./components/Coinflip/CoinflipGameScreen/CoinflipGamePage";
import CoinflipHubPage from "./components/Coinflip/CoinflipGameHub/CoinflipHubPage";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/hub",
        element: (<CoinflipHubPage/>)
    },
    {
        path: "/",
        element: (<CoinflipGamePage/>)
    }
])

function App() {
  return (
    <Wallet>
        <RouterProvider router={router}/>
    </Wallet>
  )
}

export default App;
