import mongoose from "mongoose"

const databaseConnection = async()=> {
    const connection = await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
    return connection.connections.host

}

export {databaseConnection}