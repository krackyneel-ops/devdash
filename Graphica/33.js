/* ==========================================================
   KHETCONNECT - DYNAMIC MULTI-FERTILIZER SYSTEM
   ========================================================== */

// 1. ALL FERTILIZERS DATABASE (Govt. Subsidized Prices & Specs)
const FERTILIZERS_DATABASE = {
    'urea': {
        name: 'Urea (नीम लेपित यूरिया)',
        tagline: '🌱 Nitrogen Rich (46% N) · Fast Acting · Farm Ready',
        rate: 266,
        weight: 45, // kg per bag
        mrp: 2450,
        subsidy: 2184,
        image: 'urea.jpeg.png',
        fallback: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
        badge: '⭐ Most Popular'
    },
    'dap': {
        name: 'DAP (डाई अमोनियम फॉस्फेट)',
        tagline: '🌾 Phosphorus (46% P) & Nitrogen (18% N) · Root Booster',
        rate: 1350,
        weight: 50,
        mrp: 4073,
        subsidy: 2723,
        image: 'dap.png',
        fallback: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
        badge: '🏛️ Govt DBT Subsidized'
    },
    'npk': {
        name: 'NPK 12:32:16 / 19:19:19 (मिश्रित खाद)',
        tagline: '⚖️ Complete Balanced Nutrition · Growth & High Yield',
        rate: 1470,
        weight: 50,
        mrp: 3200,
        subsidy: 1730,
        image: 'npk.png',
        fallback: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef231e5?auto=format&fit=crop&w=600&q=80',
        badge: '🌾 High Yield'
    },
    'mop': {
        name: 'MOP - Potash (म्यूरेट ऑफ पोटाश)',
        tagline: '💎 60% Potash (K2O) · Grain Shine & Disease Resistance',
        rate: 1700,
        weight: 50,
        mrp: 2950,
        subsidy: 1250,
        image: 'mop.png',
        fallback: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
        badge: '💪 Grain Booster'
    },
    'ssp': {
        name: 'SSP (सिंगल सुपर फॉस्फेट)',
        tagline: '🧪 16% Phosphate & 11% Sulphur · Best for Oilseeds & Pulses',
        rate: 500,
        weight: 50,
        mrp: 980,
        subsidy: 480,
        image: 'ssp.png',
        fallback: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
        badge: '🌱 Oilseeds Special'
    },
    'zinc': {
        name: 'Zinc Sulphate 33% (जिंक सल्फेट)',
        tagline: '🌿 Essential Micronutrient · Prevents Yellow Leaves & Khaira',
        rate: 380,
        weight: 10,
        mrp: 650,
        subsidy: 270,
        image: 'zinc.png',
        fallback: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
        badge: '⚡ Micronutrient'
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // 2. READ THE URL PARAMETER (?item=dap or ?item=urea)
    const urlParams = new URLSearchParams(window.location.search);
    const itemKey = urlParams.get('item') ? urlParams.get('item').toLowerCase() : 'urea';

    // Get selected product or fallback to urea
    const currentProduct = FERTILIZERS_DATABASE[itemKey] || FERTILIZERS_DATABASE['urea'];

    // 3. DYNAMICALLY INJECT PRODUCT DETAILS INTO PAGE
    const productTitle = document.querySelector('.product-title');
    const productTagline = document.querySelector('.product-tagline');
    const currentPriceText = document.querySelector('.current-price');
    const unitText = document.querySelector('.unit-text');
    const mrpStriked = document.querySelector('.mrp-striked');
    const productImg = document.querySelector('.product-img');
    const badgeTag = document.querySelector('.badge-tag');
    const breadcrumbItem = document.querySelector('.breadcrumb span');

    if (productTitle) productTitle.textContent = currentProduct.name;
    if (productTagline) productTagline.textContent = currentProduct.tagline;
    if (currentPriceText) currentPriceText.textContent = `₹${currentProduct.rate}`;
    if (unitText) unitText.textContent = `/ ${currentProduct.weight} kg Bag`;
    if (mrpStriked) mrpStriked.textContent = `M.R.P: ₹${currentProduct.mrp.toLocaleString('en-IN')}`;
    if (badgeTag) badgeTag.textContent = currentProduct.badge;
    if (breadcrumbItem) breadcrumbItem.textContent = currentProduct.name;

    if (productImg) {
        productImg.src = currentProduct.image;
        productImg.onerror = () => { productImg.src = currentProduct.fallback; };
    }

    // 4. LIVE PRICE & QUANTITY CALCULATIONS
    const qtyInput = document.getElementById('qtyInput');
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const totalKgText = document.getElementById('totalKgText');

    const summaryQty = document.getElementById('summaryQty');
    const summarySubsidy = document.getElementById('summarySubsidy');
    const finalTotal = document.getElementById('finalTotal');
    const payBtnAmount = document.getElementById('payBtnAmount');

    function updatePricing() {
        let qty = parseInt(qtyInput.value) || 1;
        if (qty < 1) qty = 1;
        if (qty > 100) qty = 100;
        qtyInput.value = qty;

        const totalCost = qty * currentProduct.rate;
        const totalKg = qty * currentProduct.weight;
        const totalSubsidy = qty * currentProduct.subsidy;

        if (totalKgText) totalKgText.textContent = `${totalKg} kg`;
        if (summaryQty) summaryQty.textContent = `${qty} Bag${qty > 1 ? 's' : ''} (${totalKg} kg)`;
        if (summarySubsidy) summarySubsidy.textContent = `- ₹${totalSubsidy.toLocaleString('en-IN')}.00`;
        if (finalTotal) finalTotal.textContent = `₹${totalCost.toLocaleString('en-IN')}.00`;
        if (payBtnAmount) payBtnAmount.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
    }

    btnMinus.addEventListener('click', () => {
        let cur = parseInt(qtyInput.value) || 1;
        if (cur > 1) {
            qtyInput.value = cur - 1;
            updatePricing();
        }
    });

    btnPlus.addEventListener('click', () => {
        let cur = parseInt(qtyInput.value) || 1;
        qtyInput.value = cur + 1;
        updatePricing();
    });

    qtyInput.addEventListener('input', updatePricing);

    // 5. AUTO-FILL GPS LOCATION
    const gpsBtn = document.getElementById('gpsBtn');
    if (gpsBtn) {
        gpsBtn.addEventListener('click', () => {
            gpsBtn.textContent = '🔄 Locating farm...';
            setTimeout(() => {
                document.getElementById('houseNo').value = 'Khasra No. 142/2';
                document.getElementById('locality').value = 'Near Canal Road';
                document.getElementById('village').value = 'Rampur';
                document.getElementById('city').value = 'Meerut Mandi';
                document.getElementById('state').value = 'Uttar Pradesh';
                document.getElementById('pinCode').value = '250001';
                gpsBtn.textContent = '✅ Location Detected!';
            }, 600);
        });
    }

    // 6. POPUP BILL MODAL INVOICE
    const billModal = document.getElementById('billModal');
    const btnShowBill = document.getElementById('btnShowBill');
    const closeBillModal = document.getElementById('closeBillModal');

    if (btnShowBill) {
        btnShowBill.addEventListener('click', () => {
            const qty = parseInt(qtyInput.value) || 1;
            const totalCost = qty * currentProduct.rate;
            const totalSubsidy = qty * currentProduct.subsidy;

            const h = document.getElementById('houseNo').value || 'Farm/Plot No. 45';
            const v = document.getElementById('village').value || 'Village Area';
            const c = document.getElementById('city').value || 'Mandi Center';
            const p = document.getElementById('pinCode').value || '110001';

            document.getElementById('invAddress').textContent = `${h}, ${v}, ${c} - ${p}`;
            document.getElementById('invQty').textContent = `${qty} Bag${qty > 1 ? 's' : ''}`;
            document.getElementById('invAmount').textContent = `₹${totalCost.toLocaleString('en-IN')}.00`;
            document.getElementById('invSubsidy').textContent = `₹${totalSubsidy.toLocaleString('en-IN')}.00`;
            document.getElementById('invTotal').textContent = `₹${totalCost.toLocaleString('en-IN')}.00`;
            document.getElementById('invNumber').textContent = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

            billModal.style.display = 'flex';
        });
    }

    if (closeBillModal) {
        closeBillModal.addEventListener('click', () => { billModal.style.display = 'none'; });
    }

    window.addEventListener('click', (e) => {
        if (e.target === billModal) billModal.style.display = 'none';
    });

    // 7. PAYMENT CONFIRMATION
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const method = document.querySelector('input[name="paymentMethod"]:checked').value;
            const qty = qtyInput.value;
            const total = (parseInt(qty) || 1) * currentProduct.rate;

            alert(`🎉 ORDER PLACED SUCCESSFULLY!\n\nProduct: ${currentProduct.name}\nQuantity: ${qty} Bags (${qty * currentProduct.weight} kg)\nTotal Amount: ₹${total}\nPayment Method: ${method}\n\nYour order has been forwarded to your nearest Mandi DBT depot for delivery.`);
        });
    }

    // Initialize pricing on page load
    updatePricing();
});