/* 💊 MULTI-BIRD MEDICINE MANAGER
   ব্রয়লার, কালার বার্ড, সোনালি এবং দেশি মুরগির ওষুধ ফিল্টার করার লজিক।
*/

let allMedicinesData = [];
let currentBirdType = 'ব্রয়লার'; // ডিফল্টভাবে ব্রয়লার সিলেক্ট থাকবে

// ১. ডাটাবেস থেকে ওষুধ লোড করা
function initMedicines() {
    if (typeof medDb !== 'undefined') {
        medDb.ref('admin_medicines').on('value', snapshot => {
            const data = snapshot.val();
            allMedicinesData = [];
            
            if (data) {
                Object.values(data).forEach(item => {
                    // যদি পুরানো ডাটা থাকে যাতে জাত লেখা নেই, সেগুলোকে অটোমেটিক ব্রয়লার ধরবে
                    item.birdType = item.birdType || 'ব্রয়লার';
                    allMedicinesData.push(item);
                });
            }
            renderFilteredMedicines();
        });
    }
}

// ২. ফিল্টার বাটনে ক্লিক করলে জাত পরিবর্তন করা
function setBirdFilter(type) {
    currentBirdType = type;

    // বাটনের ডিজাইন (কালার) চেঞ্জ করা
    document.querySelectorAll('.bird-filter-btn').forEach(btn => {
        if(btn.dataset.type === type) {
            btn.classList.add('bg-teal-700', 'text-white', 'shadow-md');
            btn.classList.remove('bg-white', 'text-gray-600', 'dark:bg-gray-800', 'dark:text-gray-300');
        } else {
            btn.classList.remove('bg-teal-700', 'text-white', 'shadow-md');
            btn.classList.add('bg-white', 'text-gray-600', 'dark:bg-gray-800', 'dark:text-gray-300');
        }
    });

    renderFilteredMedicines();
}

// ৩. লিস্ট রেন্ডার করা (আগের মতোই সুন্দর স্টাইলে)
function renderFilteredMedicines() {
    const container = document.getElementById('medicineListContainer');
    if(!container) return;

    container.innerHTML = '';

    // বর্তমান সিলেক্ট করা জাত অনুযায়ী ফিল্টার
    const filtered = allMedicinesData.filter(m => m.birdType === currentBirdType);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center py-20 opacity-50"><span class="material-symbols-outlined text-6xl mb-2">inventory_2</span><p>এই জাতের জন্য কোনো ওষুধ যোগ করা হয়নি</p></div>`;
        return;
    }

    // দিন অনুযায়ী গ্রুপ করা
    const grouped = {};
    filtered.forEach(item => {
        const days = item.day.split("→").map(d => d.trim());
        days.forEach(d => {
            if(!grouped[d]) grouped[d] = [];
            grouped[d].push(item);
        });
    });

    const dayStyles = [
        { bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-400" },
        { bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-400" },
        { bg: "bg-sky-50 dark:bg-sky-900/10", border: "border-sky-200 dark:border-sky-800", text: "text-sky-700 dark:text-sky-400" },
        { bg: "bg-rose-50 dark:bg-rose-900/10", border: "border-rose-200 dark:border-rose-800", text: "text-rose-700 dark:text-rose-400" }
    ];

    Object.keys(grouped).sort((a,b) => parseInt(a) - parseInt(b)).forEach((day, idx) => {
        const style = dayStyles[idx % dayStyles.length];
        const sec = document.createElement("div"); 
        sec.className = "space-y-3";
        sec.innerHTML = `<div class="flex items-center gap-3 mb-4"><span class="bg-teal-700 text-white px-3 py-1 rounded-full text-xs font-bold">দিন ${day}</span><div class="h-[1px] bg-gray-200 dark:bg-gray-700 flex-grow"></div></div>`;
        
        grouped[day].sort((a,b) => (a.serial||0) - (b.serial||0)).forEach(item => {
            sec.innerHTML += `
            <div class="p-5 border ${style.border} ${style.bg} rounded-3xl transition-all hover:shadow-md">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-lg flex items-center gap-2 dark:text-gray-100"><span class="material-symbols-outlined text-teal-700 dark:text-teal-400">medication</span>${item.medicine}</h4>
                    <span class="text-[10px] font-bold uppercase ${style.text} bg-white dark:bg-black/30 px-2 py-1 rounded-lg">${item.time}</span>
                </div>
                <div class="flex items-center gap-2 text-sm opacity-80 mb-2 dark:text-gray-300">
                    <span class="material-symbols-outlined text-sm">scale</span>পরিমাণ: ${item.amount}
                </div>
                ${item.note ? `<div class="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex gap-2"><span class="material-symbols-outlined text-sm text-red-500">info</span><p class="text-xs text-red-600 dark:text-red-400 font-medium"><b>বি:দ্র:</b> ${item.note}</p></div>` : ""}
            </div>`;
        });
        container.appendChild(sec);
    });
}

// পেজ লোড হলে ফাংশন চালু হবে
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initMedicines, 1000); 
});
