"use client";

import { useState, useEffect, useMemo } from "react";
import ProductGrid from "./components/ProductGrid";
import Header from "./components/Header";
import Filters from "./components/Filters";
import CartDrawer from "./components/CartDrawer";

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const [cart, setCart] = useState({}); // { productId: { product, quantity } }
  const [cartOpen, setCartOpen] = useState(false);


  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const courierCharge = 50; // Fixed courier charge

  

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/marketplace/products");
        const data = await res.json();
        if (data.success) setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand))];
  const tags = [...new Set(products.flatMap((p) => p.tags || []))];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchesBrand = selectedBrand ? p.brand === selectedBrand : true;
      const matchesTag = selectedTag ? p.tags?.includes(selectedTag) : true;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesBrand && matchesTag && matchesPrice;
    });
  }, [products, search, selectedCategory, selectedBrand, selectedTag, priceRange]);

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev[product._id];
      const newQuantity = existing ? existing.quantity + quantity : quantity;

      if (newQuantity > product.stock) {
        alert(`Only ${product.stock} units available!`);
        return prev;
      }

      return { ...prev, [product._id]: { product, quantity: newQuantity } };
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prev) => {
      const item = prev[productId];
      if (!item) return prev;
      if (quantity < 1) return prev;
      if (quantity > item.product.stock) {
        alert(`Only ${item.product.stock} units available!`);
        return prev;
      }
      return { ...prev, [productId]: { ...item, quantity } };
    });
  };

  const cartItems = Object.values(cart);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.price - (item.product.discount || 0);
    return acc + price * item.quantity;
  }, 0);

  const totalDeliveryCharge = cartItems.reduce((acc, item) => {
    return acc + (item.product.deliveryCharge || 0);
  }, 0);

  const total = subtotal + totalDeliveryCharge;


  // const taxRate = 0; // 0% tax
  // const tax = subtotal * taxRate;
  // const total = subtotal + tax;


  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    // Simple validation
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      alert("Please fill in all your details.");
      return;
    }
  
    try {
      setCheckoutLoading(true);
  
      const orderPayload = {
        customer: checkoutForm,
        items: cartItems.map(({ product, quantity }) => ({
          productId: product._id,
          sellerId: product.sellerId,
          quantity,
          price: product.price - (product.discount || 0),
          deliveryCharge: product.deliveryCharge || 0, // use product-specific delivery charge
        })),
        createdAt: new Date(),
      };
  
      const res = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.message || "Failed to place order.");
        setCheckoutLoading(false);
        return;
      }
  
      alert("Order placed successfully! Your seller will contact you soon.");
      setCart({});
      setCartOpen(false);
      setCheckoutForm({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };




  if (loading) return <p className="text-center mt-20">Loading products...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header cartItemCount={cartItems.length} onCartClick={() => setCartOpen(true)} />

        {/* Filters */}
        <Filters
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categories={categories}
          brands={brands}
          tags={tags}
        />

        {/* Product Grid */}
        {/* Product Grid */}
        <ProductGrid products={filteredProducts} addToCart={addToCart} />
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        checkoutForm={checkoutForm}
        setCheckoutForm={setCheckoutForm}
        handleCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
      />
    </div>
  );
}
