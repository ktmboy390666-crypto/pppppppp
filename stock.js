/* 📦 MY STOCK MANAGER
   স্টক পেজের ডিজাইন এবং লজিক সব এখানে থাকবে।
   এটি অটোমেটিক HTML ইনজেক্ট করবে।
*/

// ১. স্টক পেজের HTML স্ট্রাকচার (জাভাস্ক্রিপ্ট দিয়ে তৈরি হবে)
const stockPageHTML = `
<div id="stock-page" class="page tab-page bg-gray-50 dark:bg-gray-900 transition-all duration-300">
    <header class="sticky top-0 z-10 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 flex items-center">
        <button onclick="goBack()" class="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="material-symbols-outlined dark:text-white">arrow_back</span>
        </button>
        <h1 class="text-xl font-bold dark:text-white">আমার স্টক</h1>
    </header>

    <div class="p-5 pb-28 space-y-4">
        <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <span class="text-2xl">📦</span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bold">মোট আইটেম</p>
                <h3 class="text-xl font-bold text-blue-700 dark:text-blue-400" id="total-stock-items">0</h3>
            </div>
            <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                <span class="text-2xl">💊</span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bold">ঔষধ</p>
                <h3 class="text-xl font-bold text-purple-700 dark:text-purple-400" id="total-medicine-stock">0</h3>
            </div>
        </div>

        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onclick="filterStock('all')" class="px-4 py-2 rounded-full bg-teal-700 text-white text-xs font-bold whitespace-nowrap shadow-sm">সব</button>
            <button onclick="filterStock('Feed')" class="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold whitespace-nowrap">খাবার</button>
            <button onclick="filterStock('Medicine')" class="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold whitespace-nowrap">ঔষধ</button>
            <button onclick="filterStock('Equipment')" class="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold whitespace-nowrap">পাত্র/সরঞ্জাম</button>
        </div>

        <div id="stock-list-container" class="space-y-3">
            <p class="text-center text-gray-400 text-sm py-10">লোড হচ্ছে...</p>
        </div>
    </div>

    <div class="fixed bottom-10 right-6 z-20">
        <button onclick="openStockModal()" class="w-14 h-14 rounded-full bg-teal-700 text-white shadow-xl flex items-center justify-center transform transition hover:scale-110 active:scale-95">
            <span class="material-symbols-outlined text-3xl">add</span>
        </button>
    </div>
</div>

<div id="stock-modal" class="hidden fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 w-full sm:w-96 rounded-t-3xl sm:rounded-3xl p-6 relative animate-[slideUp_0.3s_ease-out]">
        <button onclick="closeStockModal()" class="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-100 hover:text-red-500 transition">
            <span class="material-symbols-outlined dark:text-gray-300">close</span>
        </button>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6" id="stock-modal-title">নতুন স্টক যোগ করুন</h2>
        
        <form onsubmit="saveStock(event)" class="space-y-4">
            <input type="hidden" id="stock-id">
            
            <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">আইটেমের নাম</label>
                <input id="stock-name" required placeholder="যেমন: নাপা, ফিড, পানির পাত্র" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">পরিমাণ</label>
                    <input id="stock-qty" type="number" required placeholder="0" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">একক (Unit)</label>
                    <select id="stock-unit" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                        <option value="টি">টি (Piece)</option>
                        <option value="বস্তা">বস্তা (Bag)</option>
                        <option value="কেজি">কেজি (KG)</option>
                        <option value="লিটার">লিটার (L)</option>
                        <option value="প্যাকেট">প্যাকেট (Packet)</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">ক্যাটাগরি</label>
                <select id="stock-category" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                    <option value="Feed">খাবার (Feed)</option>
                    <option value="Medicine">ঔষধ (Medicine)</option>
                    <option value="Equipment">পাত্র/সরঞ্জাম (Equipment)</option>
                    <option value="Gura">গুড়া (Shavings)</option>
                    <option value="Others">অন্যান্য (Others)</option>
                </select>
            </div>

            <button type="submit" class="w-full p-4 bg-teal-700 text-white font-bold rounded-xl shadow-lg mt-2">সেভ করুন</button>
            
            <button type="button" onclick="deleteStockItem()" id="btn-delete-stock" class="w-full p-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl hidden">ডিলিট করুন</button>
        </form>
    </div>
</div>
`;

// ২. অ্যাপ লোড হলে পেজটি মেইন অ্যাপে ইনজেক্ট করা
document.addEventListener('DOMContentLoaded', () => {
    // মেইন অ্যাপ কন্টেইনারে স্টক পেজ ঢুকিয়ে দেওয়া
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
        mainApp.insertAdjacentHTML('beforeend', stockPageHTML);
    }
});

// ৩. স্টক ম্যানেজমেন্ট লজিক
let allStockData = [];

// পেজ ওপেন করার ফাংশন
function openStockPage() {
    navigate('stock-page');
    loadStockData();
}

// ফায়ারবেস থেকে ডাটা আনা
function loadStockData() {
    if (!currentUser) return;
    const listContainer = document.getElementById('stock-list-container');
    
    db.ref(`users/${currentUser.uid}/stock`).on('value', snapshot => {
        const data = snapshot.val();
        listContainer.innerHTML = '';
        allStockData = [];
        
        let totalItems = 0;
        let totalMed = 0;

        if (!data) {
            listContainer.innerHTML = `<div class="text-center py-10 opacity-50"><span class="material-symbols-outlined text-6xl mb-2">inventory_2</span><p>স্টক খালি</p></div>`;
            updateStockSummary(0, 0);
            return;
        }

        Object.entries(data).forEach(([key, item]) => {
            allStockData.push({ id: key, ...item });
            totalItems += parseFloat(item.quantity) || 0;
            if (item.category === 'Medicine') totalMed++;
        });

        // ডিফল্টভাবে সব দেখাবে
        renderStockList(allStockData);
        updateStockSummary(Object.keys(data).length, totalMed);
    });
}

function renderStockList(items) {
    const listContainer = document.getElementById('stock-list-container');
    listContainer.innerHTML = '';
    
    // ক্যাটাগরি অনুযায়ী আইকন
    const icons = { 'Feed': '🌾', 'Medicine': '💊', 'Equipment': '🥣', 'Gura': '🪵', 'Others': '📦' };
    const colors = { 'Feed': 'text-amber-600 bg-amber-50', 'Medicine': 'text-purple-600 bg-purple-50', 'Equipment': 'text-blue-600 bg-blue-50', 'Gura': 'text-orange-600 bg-orange-50', 'Others': 'text-gray-600 bg-gray-50' };

    items.forEach(item => {
        const icon = icons[item.category] || '📦';
        const colorClass = colors[item.category] || 'text-gray-600 bg-gray-50';
        
        const html = `
        <div onclick="editStock('${item.id}')" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-50 dark:border-gray-700 cursor-pointer hover:shadow-md transition">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full ${colorClass} dark:bg-opacity-20 flex items-center justify-center text-xl">
                    ${icon}
                </div>
                <div>
                    <h4 class="font-bold text-gray-800 dark:text-gray-200">${item.name}</h4>
                    <p class="text-xs text-gray-400">${item.category}</p>
                </div>
            </div>
            <div class="text-right">
                <span class="font-bold text-lg text-teal-700 dark:text-teal-400">${item.quantity}</span>
                <span class="text-xs text-gray-500 font-bold">${item.unit}</span>
            </div>
        </div>`;
        listContainer.innerHTML += html;
    });
}

// ফিল্টার ফাংশন
function filterStock(category) {
    if (category === 'all') {
        renderStockList(allStockData);
    } else {
        const filtered = allStockData.filter(item => item.category === category);
        renderStockList(filtered);
    }
}

function updateStockSummary(total, med) {
    document.getElementById('total-stock-items').innerText = total;
    document.getElementById('total-medicine-stock').innerText = med;
}

// ৪. অ্যাড/এডিট/ডিলিট ফাংশন
function openStockModal() {
    document.forms[3].reset(); // রিসেট ফর্ম (ধরে নিচ্ছি এটি ৩য় ফর্ম, অথবা ID দিয়ে ধরা ভালো)
    document.getElementById('stock-id').value = '';
    document.getElementById('stock-modal-title').innerText = "নতুন স্টক যোগ করুন";
    document.getElementById('btn-delete-stock').classList.add('hidden');
    document.getElementById('stock-modal').classList.remove('hidden');
}

function closeStockModal() {
    document.getElementById('stock-modal').classList.add('hidden');
}

function editStock(id) {
    const item = allStockData.find(i => i.id === id);
    if (!item) return;

    document.getElementById('stock-id').value = id;
    document.getElementById('stock-name').value = item.name;
    document.getElementById('stock-qty').value = item.quantity;
    document.getElementById('stock-unit').value = item.unit;
    document.getElementById('stock-category').value = item.category;

    document.getElementById('stock-modal-title').innerText = "স্টক আপডেট করুন";
    document.getElementById('btn-delete-stock').classList.remove('hidden');
    document.getElementById('stock-modal').classList.remove('hidden');
}

function saveStock(e) {
    e.preventDefault();
    if (!currentUser) return;

    const id = document.getElementById('stock-id').value;
    const data = {
        name: document.getElementById('stock-name').value,
        quantity: document.getElementById('stock-qty').value,
        unit: document.getElementById('stock-unit').value,
        category: document.getElementById('stock-category').value,
        lastUpdated: new Date().toISOString()
    };

    if (id) {
        db.ref(`users/${currentUser.uid}/stock/${id}`).update(data);
        showToast("স্টক আপডেট হয়েছে ✅");
    } else {
        db.ref(`users/${currentUser.uid}/stock`).push(data);
        showToast("নতুন স্টক যোগ হয়েছে 🎉");
    }
    closeStockModal();
}

function deleteStockItem() {
    const id = document.getElementById('stock-id').value;
    if (id && confirm("আপনি কি নিশ্চিত এই আইটেমটি ডিলিট করবেন?")) {
        db.ref(`users/${currentUser.uid}/stock/${id}`).remove();
        showToast("ডিলিট হয়েছে 🗑️");
        closeStockModal();
    }
}
