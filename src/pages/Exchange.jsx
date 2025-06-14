import React, { useEffect, useState } from 'react';

// Direct fetch from CoinGecko public API
async function getTopCoins() {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h'
  );
  if (!res.ok) throw new Error('Failed to fetch coins');
  return res.json();
}

function PriceCell({ price, prevPrice }) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (prevPrice !== undefined && prevPrice !== price) {
      setBlink(true);
      const timeout = setTimeout(() => setBlink(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [price, prevPrice]);

  let color = '';
  if (prevPrice !== undefined && price > prevPrice) color = 'text-green-400';
  if (prevPrice !== undefined && price < prevPrice) color = 'text-red-400';

  return (
    <td
      className={`p-2 font-mono font-bold transition-colors duration-200 ${
        blink ? 'bg-yellow-300 text-black' : color
      }`}
    >
      ${price}
    </td>
  );
}

export default function Exchange() {
  const [coins, setCoins] = useState([]);
  const [prevPrices, setPrevPrices] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getTopCoins();
      setPrevPrices((prev) => {
        const newPrev = {};
        data.forEach((coin) => {
          newPrev[coin.id] = coins.find((c) => c.id === coin.id)?.current_price;
        });
        return newPrev;
      });
      setCoins(data);
      setLoading(false);
    } catch {
      setCoins([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3 text-primary">Top 20 Coins</h2>
      {loading && <div className="text-center py-6">Loading...</div>}
      {!loading && (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm bg-darkcard rounded-lg shadow">
            <thead>
              <tr className="text-left border-b border-darkbg">
                <th className="p-2">#</th>
                <th className="p-2">Coin</th>
                <th className="p-2">Price (USD)</th>
                <th className="p-2">% 24h</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, idx) => (
                <tr key={coin.id} className="hover:bg-darkbg transition">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2 flex items-center">
                    <img src={coin.image} alt={coin.name} className="h-6 w-6 mr-2" />
                    {coin.name}
                  </td>
                  <PriceCell price={coin.current_price} prevPrice={prevPrices[coin.id]} />
                  <td
                    className={`p-2 font-bold ${
                      coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}