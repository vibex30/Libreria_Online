/**
 * ShoppingCart 2.0
 *  - Usa un Map   : key  = nombre del producto (string)
 *                   value = { qty, price, data }  // data -> objeto libre
 *  - Métodos para CRUD + totales (sin y con IVA)
 */
export default class ShoppingCart {
    /** @param {string} key Clave en localStorage */
    constructor(key = 'carrito', taxRate = 0.21) {
      this.key       = key;
      this.taxRate   = taxRate;              // 21 % por defecto
      this.cart      = this.#load();         // Map<string,{qty,price,data}>
    }
  
    /* ╔════════════════════════════════╗
       ║  Persistencia localStorage     ║
       ╚════════════════════════════════╝ */
    #load() {
      const raw = localStorage.getItem(this.key);
      return raw ? new Map(JSON.parse(raw)) : new Map();
    }
  
    #save() {
      localStorage.setItem(this.key, JSON.stringify([...this.cart]));
    }
  
    /* ╔════════════════════════════════╗
       ║  Getters «read‑only»           ║
       ╚════════════════════════════════╝ */
    /** Cantidad total de unidades en el carrito */
    get totalQty() {
      let sum = 0;
      for (const { qty } of this.cart.values()) sum += qty;
      return sum;
    }
  
    /** Valor sin impuestos */
    get subtotal() {
      let sum = 0;
      for (const { qty, price } of this.cart.values()) sum += qty * price;
      return +sum.toFixed(2);
    }
  
    /** Importe de impuestos (IVA) */
    get tax() {
      return +(this.subtotal * this.taxRate).toFixed(2);
    }
  
    /** Valor con impuestos */
    get total() {
      return +(this.subtotal + this.tax).toFixed(2);
    }
  
    /** Devuelve una copia serializable del carrito */
    toJSON() {
      return Object.fromEntries(this.cart);
    }
  
    /* ╔════════════════════════════════╗
       ║  Mutadores CRUD                ║
       ╚════════════════════════════════╝ */
    /**
     * Añade o incrementa un producto
     * @param {string}  name              Identificador único
     * @param {number}  price             Precio unitario (€)
     * @param {object=} data              Cualquier info extra (img, autor…)
     * @param {number=} qty               Unidades a añadir (default 1)
     */
    add(name, price, data = {}, qty = 1) {
      const item = this.cart.get(name) || { qty: 0, price, data };
      item.qty  += qty;
      item.price = price;          // actualiza si ha cambiado
      item.data  = { ...item.data, ...data };
      this.cart.set(name, item);
      this.#save();
    }
  
    /**
     * Reduce unidades; elimina si llega a 0
     * @param {string} name
     * @param {number} qtyRestar
     */
    reduce(name, qtyRestar = 1) {
      const item = this.cart.get(name);
      if (!item) return;
      item.qty -= qtyRestar;
      item.qty > 0 ? this.cart.set(name, item) : this.cart.delete(name);
      this.#save();
    }
  
    /** Establece cantidad exacta */
    setQty(name, newQty) {
      if (newQty <= 0) {
        this.cart.delete(name);
      } else {
        const item = this.cart.get(name);
        if (item) {
          item.qty = newQty;
          this.cart.set(name, item);
        }
      }
      this.#save();
    }
  
    /** Borra por completo */
    remove(name) {
      this.cart.delete(name);
      this.#save();
    }
  
    /** Vacía el carrito */
    clear() {
      this.cart.clear();
      localStorage.removeItem(this.key);
    }
  }
  