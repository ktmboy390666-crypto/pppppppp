/* 📊 DAILY REPORT MANAGER
   এখানে প্রতিদিনের মৃত্যুহার (Mortality), খাবার এবং ওজন রেকর্ড করা হবে।
*/

// ১. পেজের HTML স্ট্রাকচার
const reportPageHTML = `
<div id="daily-report-page" class="page tab-page bg-gray-50 dark:bg-gray-900 transition-all duration-300">
    <header class="sticky top-0 z-10 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 flex items-center shadow-sm">
        <button onclick="goBack()" class="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span class="material-symbols-outlined dark:text-white">arrow_back</span>
        </button>
        <div class="flex-grow">
            <h1 class="text-xl font-bold dark:text-white">দৈনিক রিপোর্ট</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">মৃত্যু ও গ্রোথ মনিটরিং</p>
        </div>
    </header>

    <div class="p-5 pb-28 space-y-4">
        
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2">কোন চালানের রিপোর্ট?</label>
            <select id="report-shipment-select" onchange="loadReportData(this.value)" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold">
                <option value="">লোড হচ্ছে...</option>
            </select>
        </div>

        <div id="report-summary-section" class="grid grid-cols-2 gap-3 hidden">
            <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800 text-center">
                <span class="text-2xl">💀</span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bold">মোট মৃত্যু</p>
                <h3 class="text-2xl font-bold text-red-600 dark:text-red-400" id="total-mortality">0</h3>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
                <span class="text-2xl">⚖️</span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bold">বর্তমান ওজন</p>
                <h3 class="text-xl font-bold text-blue-700 dark:text-blue-400" id="last-weight">0g</h3>
            </div>
        </div>

        <div>
            <h3 class="font-bold text-gray-700 dark:text-gray-300 mb-3 px-1">বিগত দিনের তথ্য</h3>
            <div id="report-list-container" class="space-y-3">
                <p class="text-center text-gray-400 text-sm py-10">চালান সিলেক্ট করুন</p>
            </div>
        </div>
    </div>

    <div id="add-report-btn" class="fixed bottom-10 right-6 z-20 hidden">
        <button onclick="openReportModal()" class="w-14 h-14 rounded-full bg-teal-700 text-white shadow-xl flex items-center justify-center transform transition hover:scale-110 active:scale-95">
            <span class="material-symbols-outlined text-3xl">add</span>
        </button>
    </div>
</div>

<div id="report-modal" class="hidden fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 w-full sm:w-96 rounded-t-3xl sm:rounded-3xl p-6 relative animate-[slideUp_0.3s_ease-out]">
        <button onclick="closeReportModal()" class="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-100 hover:text-red-500 transition">
            <span class="material-symbols-outlined dark:text-gray-300">close</span>
        </button>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6">আজকের রিপোর্ট</h2>
        
        <form onsubmit="saveReport(event)" class="space-y-4">
            <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">তারিখ</label>
                <input id="report-date" type="date" required class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-red-500 ml-1">মারা গেছে (সংখ্যা)</label>
                    <input id="report-dead" type="number" placeholder="0" class="w-full p-3 rounded-xl border border-red-200 bg-red-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1 text-red-600 font-bold">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">গড় ওজন (গ্রাম)</label>
                    <input id="report-weight" type="number" placeholder="যেমন: 500" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                </div>
            </div>

            <div>
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">খাবার খেয়েছে (কেজি)</label>
                <input id="report-feed" type="number" placeholder="অপশনাল" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
            </div>

            <button type="submit" class="w-full p-4 bg-teal-700 text-white font-bold rounded-xl shadow-lg mt-2">সেভ করুন</button>
        </form>
    </div>
</div>
`;

// ২. অ্যাপ লোড হলে পেজ ইনজেক্ট
document.addEventListener('DOMContentLoaded', () => {
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
        mainApp.insertAdjacentHTML('beforeend', reportPageHTML);
    }
});

// ৩. লজিক
let activeReportShipmentId = null;

function openDailyReportPage() {
    navigate('daily-report-page');
    loadShipmentDropdown();
}

// ড্রপডাউনে চালান লোড করা
function loadShipmentDropdown() {
    if (!currentUser) return;
    const select = document.getElementById('report-shipment-select');
    
    db.ref(`users/${currentUser.uid}/shipments`).once('value', snapshot => {
        const data = snapshot.val();
        select.innerHTML = '<option value="">একটি চালান বেছে নিন</option>';
        
        if (data) {
            Object.entries(data).reverse().forEach(([id, item]) => {
                const opt = document.createElement('option');
                opt.value = id;
                opt.innerText = `${item.name} (${item.startDate})`;
                select.appendChild(opt);
            });
            
            // যদি আগে কোনো চালান দেখা হয়ে থাকে, সেটা অটো সিলেক্ট করো
            if (currentShipmentId) {
                select.value = currentShipmentId;
                loadReportData(currentShipmentId);
            }
        } else {
            select.innerHTML = '<option value="">কোনো চালান নেই</option>';
        }
    });
}

// রিপোর্ট লোড করা
function loadReportData(shipmentId) {
    if (!shipmentId) return;
    activeReportShipmentId = shipmentId;
    
    document.getElementById('report-summary-section').classList.remove('hidden');
    document.getElementById('add-report-btn').classList.remove('hidden');
    const listContainer = document.getElementById('report-list-container');
    listContainer.innerHTML = '<p class="text-center text-gray-400">লোড হচ্ছে...</p>';

    db.ref(`users/${currentUser.uid}/shipments/${shipmentId}/daily_reports`).on('value', snapshot => {
        const data = snapshot.val();
        listContainer.innerHTML = '';
        
        let totalDead = 0;
        let lastRecordedWeight = 0;

        if (!data) {
            listContainer.innerHTML = `<div class="text-center py-10 opacity-50"><p>আজকের রিপোর্ট এখনো দেননি</p></div>`;
        } else {
            // ডাটা সাজানো (নতুন তারিখ উপরে)
            const reports = Object.entries(data).sort((a, b) => new Date(b[1].date) - new Date(a[1].date));
            
            reports.forEach(([key, item]) => {
                totalDead += parseFloat(item.dead) || 0;
                if (parseFloat(item.weight) > 0 && lastRecordedWeight === 0) {
                    lastRecordedWeight = item.weight; // লেটেস্ট ওজন
                }

                const html = `
                <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-50 dark:border-gray-700 flex justify-between items-center relative group">
                    <div>
                        <p class="text-xs text-gray-400 font-bold mb-1">${item.date}</p>
                        <div class="flex gap-4">
                            ${item.dead > 0 ? `<span class="text-red-600 font-bold flex items-center gap-1"><span class="material-symbols-outlined text-sm">skull</span> ${item.dead}</span>` : '<span class="text-green-500 text-sm">মৃত্যু নেই</span>'}
                            ${item.feed > 0 ? `<span class="text-amber-600 text-sm flex items-center gap-1"><span class="material-symbols-outlined text-sm">grass</span> ${item.feed} কেজি</span>` : ''}
                        </div>
                    </div>
                    <div class="text-right">
                        ${item.weight > 0 ? `<span class="block font-bold text-teal-700 dark:text-teal-400 text-lg">${item.weight}g</span>` : '<span class="text-xs text-gray-400">ওজন নাই</span>'}
                        <button onclick="deleteReport('${key}')" class="text-red-400 text-xs mt-1 hover:underline">ডিলিট</button>
                    </div>
                </div>`;
                listContainer.innerHTML += html;
            });
        }

        // সামারি আপডেট
        document.getElementById('total-mortality').innerText = totalDead;
        document.getElementById('last-weight').innerText = lastRecordedWeight > 0 ? lastRecordedWeight + 'g' : 'N/A';
    });
}

// অ্যাড মডাল ওপেন
function openReportModal() {
    document.forms[4].reset(); // রিসেট (ধরে নিচ্ছি এটি ৪র্থ ফর্ম)
    document.getElementById('report-date').valueAsDate = new Date();
    document.getElementById('report-modal').classList.remove('hidden');
}

function closeReportModal() {
    document.getElementById('report-modal').classList.add('hidden');
}

// ডাটা সেভ
function saveReport(e) {
    e.preventDefault();
    if (!activeReportShipmentId) return alert("কোনো চালান সিলেক্ট করা নেই!");

    const data = {
        date: document.getElementById('report-date').value,
        dead: document.getElementById('report-dead').value || 0,
        weight: document.getElementById('report-weight').value || 0,
        feed: document.getElementById('report-feed').value || 0
    };

    db.ref(`users/${currentUser.uid}/shipments/${activeReportShipmentId}/daily_reports`).push(data)
        .then(() => {
            showToast("রিপোর্ট সেভ হয়েছে ✅");
            closeReportModal();
        });
}

// ডিলিট
function deleteReport(key) {
    if (confirm("এই রিপোর্ট মুছে ফেলবেন?")) {
        db.ref(`users/${currentUser.uid}/shipments/${activeReportShipmentId}/daily_reports/${key}`).remove();
    }
}
