import mongoose from 'mongoose'

const config = {
  mongo: {
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      socketTimeoutMS: 30000,
      keepAlive: true,
      maxPoolSize: 50,
      autoIndex: false,
      retryWrites: false,
    },
  },
  server: {
    host: 'localhost',
    port: 5000,
  },
}

const connectDB = async (): Promise<void> => {
  await mongoose
    .connect(`${process.env.MONGO_URI}`, config.mongo.options)
    .then(() => {
      console.log('DB connected.')
    })
    .catch((error) => {
      console.log(error)
    })
}

export default connectDB
