/* 🔔 NOTIFICATION SYSTEM MANAGER
   এই ফাইলে সব নোটিফিকেশন কন্ট্রোল করা হয়।
*/

// ১. নোটিফিকেশন ডাটা (এখানে আপনি নতুন নতুন মেসেজ যুক্ত করতে পারবেন)
const notificationData = [
    {
        icon: '🎉', 
        color: 'bg-green-100 text-green-600', 
        title: 'অ্যাপে স্বাগতম!', 
        desc: 'আপনার খামারের হিসাব এখন হাতের মুঠোয়।'
    },
    {
        icon: '💊', 
        color: 'bg-orange-100 text-orange-600', 
        title: 'ওষুধের রিমাইন্ডার', 
        desc: 'আজকের ওষুধের তালিকাটি চেক করতে ভুলবেন না।'
    },
    {
        icon: '🌡️', 
        color: 'bg-red-100 text-red-600', 
        title: 'তাপমাত্রার সতর্কতা', 
        desc: 'দুপুরে তাপমাত্রা বেশি হতে পারে। ফ্যান চালিয়ে রাখুন।'
    },
    {
        icon: '💰', 
        color: 'bg-teal-100 text-teal-600', 
        title: 'আজকের বাজার দর', 
        desc: 'ব্রয়লার পাইকারি: ১৭০ টাকা/কেজি। সোনালি: ২৩০ টাকা।'
    },
    {
        icon: '💉', 
        color: 'bg-blue-100 text-blue-600', 
        title: 'ভ্যাকসিন রিমাইন্ডার', 
        desc: 'আগামীকাল গামবোরো ভ্যাকসিন দেওয়ার তারিখ।'
    },
    {
        icon: '📦', 
        color: 'bg-yellow-100 text-yellow-600', 
        title: 'স্টক অ্যালার্ট', 
        desc: 'আপনার স্টকে খাবার প্রায় শেষ। দ্রুত অর্ডার করুন।'
    },
    {
        icon: '📝', 
        color: 'bg-pink-100 text-pink-600', 
        title: 'হিসাব আপডেট', 
        desc: 'গতকালকের খাবারের হিসাব এখনো যুক্ত করেননি।'
    },
    {
        icon: '🏆', 
        color: 'bg-indigo-100 text-indigo-600', 
        title: 'অভিনন্দন!', 
        desc: 'আপনার খামারের মৃত্যুহার এবার ২% এর নিচে। দারুণ!'
    }
];

// ২. অ্যাপ চালু হলে এই ফাংশনটি নোটিফিকেশন লোড করবে
document.addEventListener('DOMContentLoaded', () => {
    renderNotifications();
});

// ৩. নোটিফিকেশন লিস্ট তৈরি করার ফাংশন
function renderNotifications() {
    const listContainer = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    
    // যদি HTML এ লিস্ট না থাকে, তাহলে ফিরে যাও (এরর আটকাবে)
    if (!listContainer) return;

    // আগের সব ক্লিয়ার করা
    listContainer.innerHTML = '';

    // লুপ চালিয়ে ডাটা থেকে লিস্ট বানানো
    notificationData.forEach(item => {
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

    // ব্যাজ আপডেট (লাল বাতিতে সংখ্যা দেখানো)
    if (badge) {
        badge.innerText = notificationData.length;
        badge.classList.remove('hidden');
        // স্টাইল সেট করা
        badge.className = "absolute top-2 right-2 w-4 h-4 bg-red-600 border border-white dark:border-gray-700 rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-pulse";
    }
}

// ৪. বেল আইকনে ক্লিক করলে যা হবে (Toggle)
function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    dropdown.classList.toggle('hidden');
}

// ৫. "মুছে ফেলুন" বাটনে ক্লিক করলে যা হবে
function clearNotifications() {
    const list = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    
    list.innerHTML = `
        <div class="p-8 text-center flex flex-col items-center opacity-50">
            <span class="material-symbols-outlined text-4xl mb-2">notifications_off</span>
            <p class="text-xs">সব ক্লিয়ার! কোনো নোটিফিকেশন নেই</p>
        </div>
    `;
    
    // লাল বাতি নিভিয়ে দেওয়া
    if (badge) badge.classList.add('hidden');
}

// ৬. স্ক্রিনের অন্য কোথাও ক্লিক করলে ড্রপডাউন বন্ধ হবে
window.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    const dropdown = document.getElementById('notif-dropdown');
    
    if (dropdown && !dropdown.classList.contains('hidden')) {
        // যদি বাটনে ক্লিক না করা হয়, তবেই বন্ধ হবে
        if (!btn || !btn.onclick || !btn.onclick.toString().includes('toggleNotifications')) {
            dropdown.classList.add('hidden');
        }
    }
});
