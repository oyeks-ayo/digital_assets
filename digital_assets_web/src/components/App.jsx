import { useEffect, useState } from 'react'
import '../App.css'

function App() {
  const [errorMsg, setErrorMsg] = useState(null)
  const [extPost, setExtPost] = useState([])
  const [loader, setLoader] = useState(false)
  const [searchName, setSearchName] = useState("")

  let fetchData = () => {
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&x_cg_demo_api_key=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.status.error_message) {
          setErrorMsg(data.status.error_message)
          setExtPost([])
        } else {
          setExtPost(data)
          setErrorMsg(null)
        }
        setLoader(false)
      })
      .catch((err) => {
        setErrorMsg(err.message)
        setLoader(false)
      })
  }

  useEffect(() => {
    setLoader(true)
    fetchData()
  }, [])

  // Filter function - corrected for array
  const filteredCoins = extPost && Array.isArray(extPost)
    ? extPost.filter((coin) => 
        coin.name.toLowerCase().includes(searchName.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchName.toLowerCase())
      )
    : []

  return (
    <>
      <div className='row'>
        <div className="col-md-8 offset-md-1">
          <h1 className='text-center'>Crypto Market</h1>
          <button className='btn btn-primary mb-3' onClick={fetchData}>Fetch Data</button>
          {loader && <p>Loading...</p>}
          {errorMsg && <p className='text-danger'>Error: {errorMsg}</p>}
          
          {/* Display all coins or filtered coins */}
          {extPost && Array.isArray(extPost) && (
            <div className="row">
              {(searchName ? filteredCoins : extPost).map((item, index) => (
                <div className="col-md-4 mb-3" key={item.id || index}>
                  <div className="card">
                    <img className="card-img-top" src={item.image} alt={item.name} />
                    <div className="card-body">
                      <p className="card-text"><strong>Id:</strong> {item.id}</p>
                      <p className="card-text"><strong>Name:</strong> {item.name}</p>
                      <p className="card-text"><strong>Symbol:</strong> {item.symbol.toUpperCase()}</p>
                      <p className="card-text"><strong>Current Price:</strong> ${item.current_price.toLocaleString()}</p>
                      <p className="card-text"><strong>Market Cap:</strong> ${item.market_cap.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Show message when search returns no results */}
          {searchName && filteredCoins.length === 0 && (
            <p className="text-center text-muted">No cryptocurrencies found matching "{searchName}"</p>
          )}
        </div>

        {/* SEARCH INPUT */}
        <div className="col-md-3">
          <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Search by name or symbol..." 
            value={searchName} 
            onChange={(e) => setSearchName(e.target.value)}
          />
          
          {/* Display count */}
          {extPost && Array.isArray(extPost) && (
            <p className="text-muted">
              {searchName 
                ? `Showing ${filteredCoins.length} of ${extPost.length} cryptocurrencies`
                : `Total: ${extPost.length} cryptocurrencies`
              }
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default App