/* ==========================================================
   KHETCONNECT - SPRAY MACHINE LIVE BILLING & ACTIONS
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const RATE_PER_PIECE = 1850;
    const DISCOUNT_PER_PIECE = 1050;

    const qtyInput = document.getElementById('qtyInput');
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const totalUnitsText = document.getElementById('totalUnitsText');
    const summaryQty = document.getElementById('summaryQty');
    const summaryDiscount = document.getElementById('summaryDiscount');
    const finalTotal = document.getElementById('finalTotal');
    const payBtnAmount = document.getElementById('payBtnAmount');

    // Live Calculation
    function calculate() {
        let qty = parseInt(qtyInput.value) || 1;
        if (qty < 1) qty = 1;
        if (qty > 50) qty = 50;
        qtyInput.value = qty;

        const totalCost = qty * RATE_PER_PIECE;
        const totalSavings = qty * DISCOUNT_PER_PIECE;

        totalUnitsText.textContent = `${qty} Piece${qty > 1 ? 's' : ''}`;
        summaryQty.textContent = `${qty} Piece${qty > 1 ? 's' : ''}`;
        summaryDiscount.textContent = `- ₹${totalSavings.toLocaleString('en-IN')}.00`;
        finalTotal.textContent = `₹${totalCost.toLocaleString('en-IN')}.00`;
        payBtnAmount.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
    }

    btnMinus.addEventListener('click', () => {
        let q = parseInt(qtyInput.value) || 1;
        if (q > 1) { qtyInput.value = q - 1; calculate(); }
    });

    btnPlus.addEventListener('click', () => {
        let q = parseInt(qtyInput.value) || 1;
        qtyInput.value = q + 1; calculate();
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
            document.getElementById('houseNo').value = 'Khasra No. 88/1';
            document.getElementById('locality').value = 'Near Kisan Mandi Road';
            document.getElementById('village').value = 'Fatehpur';
            document.getElementById('city').value = 'Ambala Mandi';
            document.getElementById('state').value = 'Haryana';
            document.getElementById('pinCode').value = '133001';
            gpsBtn.textContent = '✅ Location Filled!';
        }, 500);
    });

    // Bill Modal
    const billModal = document.getElementById('billModal');
    document.getElementById('btnShowBill').addEventListener('click', () => {
        const qty = parseInt(qtyInput.value) || 1;
        const totalCost = qty * RATE_PER_PIECE;
        const totalSavings = qty * DISCOUNT_PER_PIECE;

        const h = document.getElementById('houseNo').value || 'Farm Plot No. 88';
        const v = document.getElementById('village').value || 'Village Area';
        const c = document.getElementById('city').value || 'Mandi Center';
        const p = document.getElementById('pinCode').value || '110001';

        document.getElementById('invAddress').textContent = `${h}, ${v}, ${c} - ${p}`;
        document.getElementById('invQty').textContent = `${qty} Piece${qty > 1 ? 's' : ''}`;
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
        const total = (parseInt(qty) || 1) * RATE_PER_PIECE;
        const method = document.querySelector('input[name="paymentMethod"]:checked').value;

        alert(`🎉 ORDER PLACED SUCCESSFULLY!\n\nEquipment: Fertilizer & Pesticide Spray Machine (16L)\nQuantity: ${qty} Piece(s)\nTotal Amount: ₹${total.toLocaleString('en-IN')}\nPayment Method: ${method}\n\nYour equipment will be delivered directly to your farm within 24-48 hours.`);
    });

    calculate();
});