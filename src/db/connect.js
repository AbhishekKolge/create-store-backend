import { connect } from 'mongoose';

const connectDB = (url) => connect(url);

export default connectDB;
