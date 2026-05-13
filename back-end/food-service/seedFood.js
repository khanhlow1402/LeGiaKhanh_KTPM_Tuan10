require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("./models/food.model");

const foods = [
  {
    name: "Bánh Tráng Cuốn Thịt Heo",
    price: 145000,
    description: "Thịt heo luộc chín tới thái lát mỏng, cuộn kèm bánh tráng phơi sương, rau sống đa dạng và mắm cái Đà Nẵng đậm đà đặc trưng xứ biển.",
    image: "/img/banh-trang-cuon.jpg"
  },
  {
    name: "Phở Bò Tái Lăn Cao Cấp",
    price: 125000,
    description: "Nước dùng trong vắt, thơm mùi gừng sả, ăn kèm thịt bò tươi thái mỏng và thảo mộc Việt.",
    image: "/img/pho-fixed.webp"
  },
  {
    name: "Cao Lầu Hội An",
    price: 135000,
    description: "Đặc sản Hội An với sợi mì vàng óng, xá xíu đậm đà, tóp mỡ giòn rụm và rau sống Trà Quế.",
    image: "/img/cao-lau.webp"
  },
  {
    name: "Bánh Xèo Đà Nẵng",
    price: 75000,
    description: "Lớp vỏ vàng giòn tan, nhân tôm thịt tươi ngon cùng giá đỗ, ăn kèm rau sống thơm phức và nước chấm gan xay đặc trưng.",
    image: "/img/banh-xeo.jpg"
  },
  {
    name: "Bún Bò Huế Cung Đình",
    price: 95000,
    description: "Hương vị bún bò chuẩn Huế với nước dùng thơm mùi mắm ruốc, sả ớt, kèm nạm bò và chả cua.",
    image: "/img/bun-bo-hue.png"
  },
  {
    name: "Mì Quảng Tôm Thịt",
    price: 85000,
    description: "Sợi mì gạo trắng mềm, tôm tươi rim đậm đà, thịt heo quay giòn cùng nước dùng sệt đặc trưng, ăn kèm bánh đa và lạc rang.",
    image: "/img/mi-quang.webp"
  },
  {
    name: "Bánh Dừa Nướng",
    price: 45000,
    description: "Hương vị ngọt bùi của dừa tươi, thơm mùi mè rang, nướng giòn tan, là món quà quê đậm đà nghĩa tình từ Quảng Nam.",
    image: "/img/banh-dua-nuong.webp"
  },
  {
    name: "Gỏi Cá Nam Ô",
    price: 120000,
    description: "Đặc sản từ làng chài Nam Ô với cá trích tươi rói, tẩm ướp gia vị đậm đà, ăn kèm với hàng chục loại lá rừng đặc hữu và nước nước sốt đặc trưng.",
    image: "/img/goi-ca-nam-o.jpg"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Connected to MongoDB Atlas");

    await Food.deleteMany({});
    console.log("🗑️ Cleared existing food items");

    await Food.insertMany(foods);
    console.log("🍱 Successfully seeded 8 gourmet dishes!");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();
