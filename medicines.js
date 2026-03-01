/* 💊 MULTI-BIRD MEDICINE MANAGER (Bugs Fixed)
   বাংলা ফন্ট ও বানানের সমস্যার জন্য নতুন লজিক।
*/

let allMedicinesData = [];
let currentBirdType = 'broiler'; // এখন থেকে ইন্টারনাল ইংলিশ নাম ব্যবহার হবে

// ১. জাতের নাম ঠিক করার ফাংশন (যাতে বানান ভুলের জন্য ডাটা না হারায়)
function normalizeBirdType(type) {
    if (!type) return 'broiler';
    type = String(type).trim();
    
    if (type.includes('ব্রয়লার') || type.includes('বয়লার') || type.includes('Broiler')) return 'broiler';
    if (type.includes('কালার') || type.includes('Color')) return 'color_bird';
    if (type.includes('সোনালি') || type.includes('সোনালী') || type.includes('Sonali')) return 'sonali';
    if (type.includes('দেশি') || type.includes('দেশী') || type.includes('Deshi')) return 'deshi';
    
    return 'broiler'; // ডিফল্ট
}

// ২. ডাটাবেস থেকে ডাটা আনা
function initMedicines() {
    const container = document.getElementById('medicineListContainer');
    if(container) container.innerHTML = `<div class="text-center py-10 opacity-50">লোড হচ্ছে...</div>`;

    if (typeof medDb !== 'undefined') {
        medDb.ref('admin_medicines').on('value', snapshot => {
            const data = snapshot.val();
            allMedicinesData = [];
            
            if (data) {
                Object.values(data).forEach(item => {
                    // ফায়ারবেসের ডাটাকে সেফ ইংলিশ নামে কনভার্ট করে রাখছি
                    item.internalBirdType = normalizeBirdType(item.birdType);
                    item.day = String(item.day || "1"); 
                    
                    allMedicinesData.push(item);
                });
            }
            renderFilteredMedicines();
        });
    }
}

// ৩. বাটনে ক্লিক করলে জাত পরিবর্তন
function setBirdFilter(rawType) {
    // বাটন থেকে আসা বাংলা নামটাকে সেফ ইংলিশ নামে কনভার্ট করা
    currentBirdType = normalizeBirdType(rawType);

    // বাটনের কালার ও স্টাইল আপডেট
    document.querySelectorAll('.bird-filter-btn').forEach(btn => {
        const btnInternalType = normalizeBirdType(btn.dataset.type);
        
        if(btnInternalType === currentBirdType) {
            btn.classList.add('bg-teal-700', 'text-white', 'shadow-md');
            btn.classList.remove('bg-white', 'text-gray-600', 'dark:bg-gray-800', 'dark:text-gray-300');
        } else {
            btn.classList.remove('bg-teal-700', 'text-white', 'shadow-md');
            btn.classList.add('bg-white', 'text-gray-600', 'dark:bg-gray-800', 'dark:text-gray-300');
        }
    });

    renderFilteredMedicines();
}

// ৪. লিস্ট স্ক্রিনে দেখানো
function renderFilteredMedicines() {
    const container = document.getElementById('medicineListContainer');
    if(!container) return;

    container.innerHTML = '';

    // সিলেক্ট করা জাত অনুযায়ী ফিল্টার
    const filtered = allMedicinesData.filter(m => m.internalBirdType === currentBirdType);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center py-20 opacity-50"><span class="material-symbols-outlined text-6xl mb-2">inventory_2</span><p>এই জাতের জন্য কোনো ওষুধ যোগ করা হয়নি</p></div>`;
        return;
    }

    // দিন অনুযায়ী গ্রুপ করা
    const grouped = {};
    filtered.forEach(item => {
        const days = String(item.day).split("→").map(d => d.trim());
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

// অ্যাপ চালু হওয়ার সাথে সাথেই ডাটা লোড করবে
setTimeout(initMedicines, 500); 
