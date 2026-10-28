import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';

export default function AddDishModal() {
  const { isAddDishOpen, setIsAddDishOpen, addCustomDish } = usePos();

  const [dish, setDish] = useState({
    name: '',
    category: 'burger',
    price: '',
    desc: '',
    image: '',
    badge: 'New'
  });

  const [errors, setErrors] = useState({});

  if (!isAddDishOpen) return null;

  const validate = () => {
    const errs = {};
    if (!dish.name.trim()) errs.name = 'Dish name is required.';
    if (!dish.price || isNaN(dish.price) || parseFloat(dish.price) <= 0) {
      errs.price = 'Valid positive price is required.';
    }
    if (!dish.desc.trim()) errs.desc = 'Short description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addCustomDish({
      ...dish,
      price: parseFloat(dish.price),
      image:
        dish.image.trim() ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    });

    // Reset form
    setDish({
      name: '',
      category: 'burger',
      price: '',
      desc: '',
      image: '',
      badge: 'New'
    });
    setErrors({});
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAddDishOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Dish to Menu</h3>
          <button className="modal-close" onClick={() => setIsAddDishOpen(false)}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Dish Name *</label>
            <input
              type="text"
              placeholder="e.g. Truffle Parmesan Fries"
              value={dish.name}
              onChange={(e) => setDish({ ...dish, name: e.target.value })}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Category *</label>
              <select
                value={dish.category}
                onChange={(e) => setDish({ ...dish, category: e.target.value })}
              >
                <option value="burger">Burger</option>
                <option value="pizza">Pizza</option>
                <option value="pastas">Pastas</option>
                <option value="salads">Salads</option>
                <option value="drinks">Drinks</option>
                <option value="sweets">Sweets</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.5"
                placeholder="14.99"
                value={dish.price}
                onChange={(e) => setDish({ ...dish, price: e.target.value })}
              />
              {errors.price && <div className="error-text">{errors.price}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Short Description *</label>
            <input
              type="text"
              placeholder="Crispy golden russet fries with shaved black truffle"
              value={dish.desc}
              onChange={(e) => setDish({ ...dish, desc: e.target.value })}
            />
            {errors.desc && <div className="error-text">{errors.desc}</div>}
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={dish.image}
              onChange={(e) => setDish({ ...dish, image: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsAddDishOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add to Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
