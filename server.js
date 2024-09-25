const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { cloudinaryConfig } = require('./config/cloudinaryConfig');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


dotenv.config(); // .env dosyasını yükleme

// Express uygulaması oluşturuluyor
const app = express();

app.use(bodyParser.json()); // Bu satırı `app` tanımlandıktan sonra yerleştirin

connectDB();
cloudinaryConfig();

// CORS Yapılandırması


//online
 app.use(cors({
   origin: ['https://harpiadamas.com.tr', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: true
 }));
//localhost:
//app.use(cors({
//  origin: 'http://localhost:3000', // React uygulamanızın çalıştığı adres
//  credentials: true
//}));

app.use(cors());

app.use(express.json());

// Route dosyaları
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const collectionRoutes = require('./routes/collection');
const bannerRoutes = require('./routes/banner');
const cartRoutes = require('./routes/cartRoutes');
const favoritesRoutes = require('./routes/favorites');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api', dashboardRoutes);
// Veritabanına bağlanma
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB bağlantısı başarılı');
}).catch((error) => {
    console.error('MongoDB bağlantı hatası:', error);
});

// Rotalar
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);

// Sunucuyu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://infinite-lowlands-79558-2a3b036b6b9a.herokuapp.com;"
  );
  next();
});
