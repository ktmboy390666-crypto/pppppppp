/* 🔔 SMART NOTIFICATION SYSTEM
   এটি শুধুমাত্র দিনের সময় অনুযায়ী জরুরি পরামর্শ দেখাবে।
   কোনো ডেমো ডাটা (যেমন: স্টক শেষ, ভ্যাকসিন) দেখাবে না।
*/

document.addEventListener('DOMContentLoaded', () => {
    updateNotificationsBasedOnTime();
});

function updateNotificationsBasedOnTime() {
    const listContainer = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    
    if (!listContainer) return;

    // ১. বর্তমান সময় বের করা
    const now = new Date();
    const hour = now.getHours(); // ০ থেকে ২৩ পর্যন্ত

    // ২. নোটিফিকেশন লিস্ট তৈরি
    let dynamicData = [];

    // --- সময় অনুযায়ী লজিক ---
    
    // সকাল (ভোর ৫টা থেকে সকাল ১১টা)
    if (hour >= 5 && hour < 12) {
        dynamicData.push({
            icon: '☀️', color: 'bg-orange-100 text-orange-600',
            title: 'সুপ্রভাত!', desc: 'আজকের দিনটি শুভ হোক। পানির পাত্রগুলো পরিষ্কার করেছেন কি?'
        });
        dynamicData.push({
            icon: '📝', color: 'bg-blue-100 text-blue-600',
            title: 'সকালের খাবার', desc: 'মোরগগুলোকে সকালের খাবার ও ওষুধ ঠিকমতো দিন।'
        });
    }
    
    // দুপুর (১২টা থেকে বিকাল ৪টা) - গরমের সময়
    else if (hour >= 12 && hour < 16) {
        dynamicData.push({
            icon: '🔥', color: 'bg-red-100 text-red-600',
            title: 'তাপমাত্রার সতর্কতা', desc: 'শেডের তাপমাত্রা চেক করুন। ফ্যান বা স্প্রে ব্যবহার করুন।'
        });
        dynamicData.push({
            icon: '💧', color: 'bg-cyan-100 text-cyan-600',
            title: 'স্যালাইন', desc: 'গরম বেশি থাকলে পানিতে ভিটামিন-সি বা স্যালাইন দিন।'
        });
    }
    
    // বিকাল (৪টা থেকে সন্ধ্যা ৭টা)
    else if (hour >= 16 && hour < 19) {
        dynamicData.push({
            icon: '⛅', color: 'bg-green-100 text-green-600',
            title: 'বিকালের যত্ন', desc: 'লিটার (বিছানা) শুকনো আছে কি না দেখে নিন।'
        });
    }
    
    // রাত (সন্ধ্যা ৭টার পর)
    else {
        dynamicData.push({
            icon: '🌙', color: 'bg-indigo-100 text-indigo-600',
            title: 'শুভ রাত্রি', desc: 'মশা বা পোকা মাকড় থেকে সাবধানে রাখুন। লাইট ঠিক আছে তো?'
        });
        dynamicData.push({
            icon: '🔒', color: 'bg-gray-100 text-gray-600',
            title: 'নিরাপত্তা', desc: 'ঘুমানোর আগে শেডের দরজা ও নিরাপত্তা নিশ্চিত করুন।'
        });
    }

    // ৩. টিপস (মাঝেমধ্যে FCR টিপস দেখাবে, বাকি সব বাদ)
    if (Math.random() > 0.7) { 
        dynamicData.push({
            icon: '💡', color: 'bg-purple-100 text-purple-600',
            title: 'টিপস', desc: 'লাভ বাড়াতে খাবারের অপচয় রোধ করুন।'
        });
    }

    // ৪. লিস্ট রেন্ডার করা (HTML এ বসানো)
    listContainer.innerHTML = '';
    
    if (dynamicData.length === 0) {
        listContainer.innerHTML = `<div class="p-8 text-center opacity-50"><p class="text-xs">কোনো নোটিফিকেশন নেই</p></div>`;
    } else {
        dynamicData.forEach(item => {
            const div = document.createElement('div');
            div.className = "p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer";
            div.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full ${item.color} flex items-center justify-center flex-shrink-0">
                        ${item.icon}
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-800 dark:text-gray-200">${item.title}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${item.desc}</p>
                    </div>
                </div>
            `;
            listContainer.appendChild(div);
        });
    }

    // ৫. ব্যাজ আপডেট
    if (badge) {
        if (dynamicData.length > 0) {
            badge.innerText = dynamicData.length;
            badge.classList.remove('hidden');
            badge.className = "absolute top-2 right-2 w-4 h-4 bg-red-600 border border-white dark:border-gray-700 rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-pulse";
        } else {
            badge.classList.add('hidden');
        }
    }
}

// বেল আইকন টগল করার ফাংশন
function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    dropdown.classList.toggle('hidden');
}

// ক্লিয়ার ফাংশন
function clearNotifications() {
    const list = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    list.innerHTML = `<div class="p-8 text-center opacity-50"><span class="material-symbols-outlined text-4xl mb-2">notifications_off</span><p class="text-xs">সব ক্লিয়ার!</p></div>`;
    if (badge) badge.classList.add('hidden');
}

// বাইরে ক্লিক করলে বন্ধ হবে
window.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) {
        if (!btn || !btn.onclick || !btn.onclick.toString().includes('toggleNotifications')) {
            dropdown.classList.add('hidden');
        }
    }
});
