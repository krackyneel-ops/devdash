/* ==========================================================
   KHETCONNECT - WHEAT SEEDS LIVE BILLING & CALCULATION
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const RATE_PER_KG = 65;
    const DISCOUNT_PER_KG = 20; // Saves ₹20/kg compared to MRP ₹85

    const qtyInput = document.getElementById('qtyInput');
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const totalKgText = document.getElementById('totalKgText');
    const summaryQty = document.getElementById('summaryQty');
    const summaryDiscount = document.getElementById('summaryDiscount');
    const finalTotal = document.getElementById('finalTotal');
    const payBtnAmount = document.getElementById('payBtnAmount');

    // Live Calculation
    function calculate() {
        let qty = parseInt(qtyInput.value) || 40;
        if (qty < 5) qty = 5;
        if (qty > 500) qty = 500;
        qtyInput.value = qty;

        const totalCost = qty * RATE_PER_KG;
        const totalSavings = qty * DISCOUNT_PER_KG;
        const bags = Math.floor(qty / 40);
        const remainder = qty % 40;

        let bagText = `${qty} kg`;
        if (bags > 0) {
            bagText += ` (${bags} Bag${bags > 1 ? 's' : ''}${remainder > 0 ? ' + ' + remainder + ' kg' : ''})`;
        }

        totalKgText.textContent = bagText;
        summaryQty.textContent = `${qty} kg`;
        summaryDiscount.textContent = `- ₹${totalSavings.toLocaleString('en-IN')}.00`;
        finalTotal.textContent = `₹${totalCost.toLocaleString('en-IN')}.00`;
        payBtnAmount.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
    }

    btnMinus.addEventListener('click', () => {
        let q = parseInt(qtyInput.value) || 40;
        if (q > 5) {
            qtyInput.value = q - 5;
            calculate();
        }
    });

    btnPlus.addEventListener('click', () => {
        let q = parseInt(qtyInput.value) || 40;
        qtyInput.value = q + 5;
        calculate();
    });

    qtyInput.addEventListener('input', calculate);

    // Payment Radio Switch
    document.querySelectorAll('.pay-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });

    // Auto-Detect GPS Location
    const gpsBtn = document.getElementById('gpsBtn');
    gpsBtn.addEventListener('click', () => {
        gpsBtn.textContent = '🔄 Locating...';
        setTimeout(() => {
            document.getElementById('houseNo').value = 'Khasra No. 64/3';
            document.getElementById('locality').value = 'Near Canal Road';
            document.getElementById('village').value = 'Karnal Farm Zone';
            document.getElementById('city').value = 'Karnal Mandi';
            document.getElementById('state').value = 'Haryana';
            document.getElementById('pinCode').value = '132001';
            gpsBtn.textContent = '✅ Location Filled!';
        }, 500);
    });

    // Bill Modal
    const billModal = document.getElementById('billModal');
    document.getElementById('btnShowBill').addEventListener('click', () => {
        const qty = parseInt(qtyInput.value) || 40;
        const totalCost = qty * RATE_PER_KG;
        const totalSavings = qty * DISCOUNT_PER_KG;

        const h = document.getElementById('houseNo').value || 'Farm Plot No. 64';
        const v = document.getElementById('village').value || 'Village Area';
        const c = document.getElementById('city').value || 'Mandi Center';
        const p = document.getElementById('pinCode').value || '110001';

        document.getElementById('invAddress').textContent = `${h}, ${v}, ${c} - ${p}`;
        document.getElementById('invQty').textContent = `${qty} kg`;
        document.getElementById('invAmount').textContent = `₹${totalCost.toLocaleString('en-IN')}.00`;
        document.getElementById('invDiscount').textContent = `₹${totalSavings.toLocaleString('en-IN')}.00`;
        document.getElementById('invTotal').textContent = `₹${totalCost.toLocaleString('en-IN')}.00`;

        billModal.style.display = 'flex';
    });

    document.getElementById('closeBillModal').addEventListener('click', () => {
        billModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === billModal) billModal.style.display = 'none';
    });

    // Order Submit
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const qty = qtyInput.value;
        const total = (parseInt(qty) || 40) * RATE_PER_KG;
        const method = document.querySelector('input[name="paymentMethod"]:checked').value;

        alert(`🎉 SEED ORDER CONFIRMED!\n\nVariety: Wheat Seeds (गेहूं के बीज)\nQuantity: ${qty} kg\nTotal Amount: ₹${total.toLocaleString('en-IN')}\nPayment: ${method}\n\nCertified seeds will be delivered to your farm directly from the nearest seed depot.`);
    });

    calculate();
});