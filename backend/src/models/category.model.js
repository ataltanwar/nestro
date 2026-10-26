import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 100,
    unique: true
  },
  slug:{
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  quantity:{
    type: Number,
    trim: true,
    minLength: 2,
    maxLength: 10000,
    unique: false
  },
  price:{
    type: Number,
    trim: true,
    minLength: 100,
    maxLength: 1000000,
    unique: false
  },
  image:{
    type: String
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel