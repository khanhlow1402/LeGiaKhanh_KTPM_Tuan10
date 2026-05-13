import React, { useEffect, useState } from "react";
import { getFoodsApi } from "../api/food.api";
import { useCart } from "../context/CartContext";
import "../styles/Main.css";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await getFoodsApi();
      setFoods(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách món ăn. Vui lòng thử lại sau!");
      // Fallback data for demonstration if API fails
      setFoods([
        { _id: '1', name: 'Mì Ramen Đặc Biệt', price: 120000, description: 'Mì ramen vị miso cay kèm thịt xá xíu', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500' },
        { _id: '2', name: 'Phở Bò Đặc Biệt', price: 95000, description: 'Phở bò truyền thống với nước dùng thanh ngọt', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1ccd63?w=500' },
        { _id: '3', name: 'Poke Bowl Sức Khỏe', price: 150000, description: 'Cá hồi tươi cùng bơ sáp và rau củ', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <section className="hero-sec">
        <div className="container">
          {/* <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>Đồ Ăn KH3T</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Mì Ngon & Món Ăn Sạch Giao Tận Nơi</p> */}
        </div>
      </section>

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <p>Đang chuẩn bị nguyên liệu tươi ngon...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>{error}</p>
          </div>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
              <div key={food._id} className="food-card">
                <div className="food-img-container">
                  <img
                    src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"}
                    alt={food.name}
                    className="food-img"
                  />
                </div>
                <div className="food-info">
                  <h3 className="food-title">{food.name}</h3>
                  <p className="food-desc">{food.description}</p>
                  <div className="food-bottom">
                    <span className="food-price">{food.price?.toLocaleString()}đ</span>
                    <button onClick={() => addToCart(food)} className="add-btn">
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
