import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'vendor_panel';

    await mongoose.connect(`${mongoUrl}/${dbName}`);

    console.log(`MongoDB bağlantısı başarılı: ${dbName}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB bağlantı hatası:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB bağlantısı kesildi');
    });
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

export default connectDB;
