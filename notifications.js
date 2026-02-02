/* 🔔 SMART NOTIFICATION SYSTEM
   ১. দিনের সময় অনুযায়ী পরামর্শ দেখাবে।
   ২. স্টক কমে গেলে (২ বা তার কম) অটোমেটিক অ্যালার্ট দিবে।
*/

// গ্লোবাল ভেরিয়েবল
let timeNotifications = [];
let stockNotifications = [];

document.addEventListener('DOMContentLoaded', () => {
    generateTimeBasedNotifications();
    renderAllNotifications();
});

// ফায়ারবেস অথেন্টিকেশন লিসেনার (লগইন করলে স্টক চেক শুরু হবে)
if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(user => {
        if (user) {
            startStockListener(user.uid);
        } else {
            stockNotifications = []; // লগআউট হলে স্টক অ্যালার্ট ক্লিয়ার
            renderAllNotifications();
        }
    });
}

// ১. সময়ের উপর ভিত্তি করে নোটিফিকেশন তৈরি
function generateTimeBasedNotifications() {
    timeNotifications = [];
    const now = new Date();
    const hour = now.getHours();

    // সকাল
    if (hour >= 5 && hour < 12) {
        timeNotifications.push({ icon: '☀️', color: 'bg-orange-100 text-orange-600', title: 'সুপ্রভাত!', desc: 'আজকের দিনটি শুভ হোক। পানির পাত্রগুলো পরিষ্কার করেছেন কি?' });
        timeNotifications.push({ icon: '📝', color: 'bg-blue-100 text-blue-600', title: 'সকালের খাবার', desc: 'মোরগগুলোকে সকালের খাবার ও ওষুধ ঠিকমতো দিন।' });
    }
    // দুপুর (গরম)
    else if (hour >= 12 && hour < 16) {
        timeNotifications.push({ icon: '🔥', color: 'bg-red-100 text-red-600', title: 'তাপমাত্রার সতর্কতা', desc: 'শেডের তাপমাত্রা চেক করুন। ফ্যান বা স্প্রে ব্যবহার করুন।' });
        timeNotifications.push({ icon: '💧', color: 'bg-cyan-100 text-cyan-600', title: 'স্যালাইন', desc: 'গরম বেশি থাকলে পানিতে ভিটামিন-সি বা স্যালাইন দিন।' });
    }
    // বিকাল
    else if (hour >= 16 && hour < 19) {
        timeNotifications.push({ icon: '⛅', color: 'bg-green-100 text-green-600', title: 'বিকালের যত্ন', desc: 'লিটার (বিছানা) শুকনো আছে কি না দেখে নিন।' });
    }
    // রাত
    else {
        timeNotifications.push({ icon: '🌙', color: 'bg-indigo-100 text-indigo-600', title: 'শুভ রাত্রি', desc: 'মশা বা পোকা মাকড় থেকে সাবধানে রাখুন। লাইট ঠিক আছে তো?' });
        timeNotifications.push({ icon: '🔒', color: 'bg-gray-100 text-gray-600', title: 'নিরাপত্তা', desc: 'ঘুমানোর আগে শেডের দরজা ও নিরাপত্তা নিশ্চিত করুন।' });
    }

    // রেন্ডম টিপস
    if (Math.random() > 0.7) {
        timeNotifications.push({ icon: '💡', color: 'bg-purple-100 text-purple-600', title: 'টিপস', desc: 'লাভ বাড়াতে খাবারের অপচয় রোধ করুন।' });
    }
}

// ২. স্টক চেক করার লিসেনার (Real-time)
function startStockListener(uid) {
    if (typeof db === 'undefined') return;

    db.ref(`users/${uid}/stock`).on('value', snapshot => {
        stockNotifications = []; // আগের অ্যালার্ট ক্লিয়ার
        const data = snapshot.val();

        if (data) {
            Object.values(data).forEach(item => {
                // শর্ত: যদি পরিমাণ ২ বা তার কম হয় (১ বা ২)
                const qty = parseFloat(item.quantity);
                if (qty <= 2) {
                    stockNotifications.push({
                        icon: '⚠️',
                        color: 'bg-red-100 text-red-600 animate-pulse', // লাল এবং জ্বলবে-নিভবে
                        title: 'স্টক অ্যালার্ট!',
                        desc: `${item.name} প্রায় শেষ। মাত্র ${qty} ${item.unit} আছে।`
                    });
                }
            });
        }
        // স্টক আপডেট হলে আবার লিস্ট দেখাও
        renderAllNotifications();
    });
}

// ৩. সব নোটিফিকেশন একসাথে দেখানো (Stock + Time)
function renderAllNotifications() {
    const listContainer = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');

    if (!listContainer) return;

    listContainer.innerHTML = '';
    
    // প্রথমে স্টক অ্যালার্ট (সবচেয়ে জরুরি), তারপর সময়ের মেসেজ
    const allData = [...stockNotifications, ...timeNotifications];

    if (allData.length === 0) {
        listContainer.innerHTML = `<div class="p-8 text-center opacity-50"><p class="text-xs">কোনো নোটিফিকেশন নেই</p></div>`;
        if (badge) badge.classList.add('hidden');
        return;
    }

    allData.forEach(item => {
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

    // ব্যাজ আপডেট
    if (badge) {
        badge.innerText = allData.length;
        badge.classList.remove('hidden');
        badge.className = "absolute top-2 right-2 w-4 h-4 bg-red-600 border border-white dark:border-gray-700 rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-pulse";
    }
}

// টগল ফাংশন
function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    dropdown.classList.toggle('hidden');
}

// ক্লিয়ার ফাংশন
function clearNotifications() {
    // শুধু টাইমার মেসেজগুলো মুছবে, কিন্তু স্টক অ্যালার্ট থেকে যাবে (কারণ ওটা জরুরি)
    // তবে ইউজার চাইলে সব মুছে দিতে পারে
    const list = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    list.innerHTML = `<div class="p-8 text-center opacity-50"><span class="material-symbols-outlined text-4xl mb-2">notifications_off</span><p class="text-xs">সব ক্লিয়ার!</p></div>`;
    if (badge) badge.classList.add('hidden');
}

// বাইরে ক্লিক হ্যান্ডলার
window.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) {
        if (!btn || !btn.onclick || !btn.onclick.toString().includes('toggleNotifications')) {
            dropdown.classList.add('hidden');
        }
    }
});
