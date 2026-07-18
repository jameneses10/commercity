import { mountShell, initHomeCarousel, normalizeInterfaceIcons } from './ui.js';
import { loadProducts, loadCategories, loadProductDetail } from './products.js';
const page=document.body.dataset.page || 'home';
if(!document.body.dataset.noShell) mountShell(page);
loadProducts(page==='home'?8:16);
loadCategories();
loadProductDetail();
initHomeCarousel();
normalizeInterfaceIcons();
