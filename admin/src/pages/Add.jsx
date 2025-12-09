import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Shirts");

  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      if (image1) formData.append("images", image1);
      if (image2) formData.append("images", image2);
      if (image3) formData.append("images", image3);
      if (image4) formData.append("images", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Shirts");
        setBestseller(false);
        setSizes([]);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2 font-semibold">Upload Images</p>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((num) => (
            <label key={num} htmlFor={`image${num}`}>
              <img
                className="w-20 h-20 object-cover cursor-pointer border border-gray-300 rounded-md"
                src={
                  (num === 1 && image1 && URL.createObjectURL(image1)) ||
                  (num === 2 && image2 && URL.createObjectURL(image2)) ||
                  (num === 3 && image3 && URL.createObjectURL(image3)) ||
                  (num === 4 && image4 && URL.createObjectURL(image4)) ||
                  assets.upload_area
                }
                alt={`upload ${num}`}
              />
              <input
                type="file"
                id={`image${num}`}
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (num === 1) setImage1(file);
                  if (num === 2) setImage2(file);
                  if (num === 3) setImage3(file);
                  if (num === 4) setImage4(file);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 font-semibold">Product Name</p>
        <input
          type="text"
          placeholder="Type product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2 font-semibold">Product Description</p>
        <textarea
          placeholder="Write product description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2 font-semibold">Product Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>

        <div>
          <p className="mb-2 font-semibold">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Shirts">Shirts</option>
            <option value="T-shirts">T-shirts</option>
            <option value="Pants">Pants</option>
            <option value="Jeans">Jeans</option>
            <option value="Shorts">Shorts</option>
            <option value="Skirts">Skirts</option>
            <option value="Dress">Dress</option>
            <option value="Tank Top">Tank Top</option>
            <option value="Jackets">Jackets</option>
            <option value="Accessories">Accessories</option>
            <option value="Sweater">Sweater</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2 font-semibold">Product Price</p>
        <input
          type="number"
          placeholder="25"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full max-w-[200px] px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <p className="mb-2 font-semibold">Product Sizes</p>
        <div className="flex gap-2 flex-wrap">
          {["XXS", "XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 cursor-pointer rounded-md border ${
                sizes.includes(size)
                  ? "bg-pink-100 border-pink-400"
                  : "bg-slate-200 border-gray-300"
              }`}
            >
              <p>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller((prev) => !prev)}
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded-md hover:bg-gray-800"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
