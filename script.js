// ==========================================
// SPA ROUTING, APP STATE & PROTECTION
// ==========================================
let currentUser = null; 

function navigateTo(viewId) {
  // ROUTE PROTECTION
  const isArtistPortalArea = viewId.includes('artist-') && viewId !== 'view-artist-details';

  if (!currentUser && (viewId.includes('dashboard') || viewId.includes('profile') || viewId.includes('checkout') || isArtistPortalArea)) {
     showToast('Please sign in to access this area.');
     toggleLoginModal();
     return;
  }
  if (currentUser) {
     if (currentUser.role === 'customer' && isArtistPortalArea) {
        showToast('Access Denied. Artist Portal only.');
        return;
     }
     if (currentUser.role === 'artist' && (viewId === 'view-commission' || viewId === 'view-checkout')) {
        showToast('Access Denied. Switch to a collector account to purchase.');
        return;
     }
  }

  // Pre-render hooks
  if(viewId === 'view-checkout') populateCheckout();
  if(viewId === 'view-artist-home') renderArtistDashboard();
  if(viewId === 'view-artist-commissions') renderArtistCommissions();
  if(viewId === 'view-forum') {
      const activeBtn = document.querySelector('#view-forum .filter-bar .active');
      renderForum(activeBtn ? activeBtn.id.replace('forumBtn-', '') : 'hot', activeBtn);
  }

  document.querySelectorAll('.page-module').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(viewId);
  if(target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function goHome() {
   if(currentUser && currentUser.role === 'artist') navigateTo('view-artist-home');
   else navigateTo('view-home');
}

// ==========================================
// THEME & UTILS
// ==========================================
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  
  if(document.getElementById('moonIcon')) document.getElementById('moonIcon').style.display = newTheme === 'dark' ? 'none' : 'block';
  if(document.getElementById('sunIcon')) document.getElementById('sunIcon').style.display = newTheme === 'dark' ? 'block' : 'none';
  localStorage.setItem('artifyTheme', newTheme);
  
  const toggle = document.getElementById('settingsThemeToggle');
  if(toggle) toggle.checked = (newTheme === 'dark');
}

function showToast(msg) {
  const toast = document.getElementById('toastBox');
  if(!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==========================================
// LOCALSTORAGE DATABASE LAYER
// ==========================================
const LS_KEYS = {
  users: 'artifyDB_users',
  gallery: 'artifyDB_gallery',
  orders: 'artifyDB_orders',
  forum: 'artifyDB_forum',
};

const SEED_DATA = {
  users: [
    { id: 'usr-1', name: 'Priya Sharma', email: 'priya@artify.com', pass: '1234', role: 'artist' },
    { id: 'usr-2', name: 'Rahul Verma', email: 'rahul@artify.com', pass: '1234', role: 'artist' },
    { id: 'usr-3', name: 'Dev Patel', email: 'dev@artify.com', pass: '1234', role: 'artist' },
    { id: 'usr-4', name: 'Ananya Desai', email: 'ananya@artify.com', pass: '1234', role: 'artist' },
    { id: 'usr-5', name: 'Alex Carter', email: 'alex@artify.com', pass: '1234', role: 'customer' }
  ],
  gallery: [
    { id: 1, title: 'Neon Dreams', artistId: 'usr-1', style: 'Digital', price: 800, img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80', desc: 'A vibrant cyberpunk-inspired digital portrait exploring the intersection of humanity and futuristic metropolis aesthetics. Bursting with neon pinks and electric blues.', rating: 4.8 },
    { id: 2, title: 'Monochrome Silence', artistId: 'usr-2', style: 'Sketch', price: 600, img: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?w=800&q=80', desc: 'A deep emotional charcoal sketch that captures the quiet introspection of the human subject. Stark contrasts and rough textures give it an unparalleled raw feel.', rating: 4.9 },
    { id: 3, title: 'Golden Hour Likeness', artistId: 'usr-3', style: 'Realistic', price: 1200, img: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&q=80', desc: 'Classic oil painting capturing the golden hour warmth. Traditional glazing techniques were used to create lifelike skin tones and luminous lighting.', rating: 5 },
    { id: 4, title: 'Ethereal Whispers', artistId: 'usr-4', style: 'Digital', price: 950, img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80', desc: 'An abstract digital artwork employing soft pastels and flowing lines to evoke a dreamlike, weightless atmosphere. Perfect for modern spaces.', rating: 4.7 },
    { id: 5, title: 'Cartoon Me', artistId: 'usr-1', style: 'Cartoon', price: 400, img: 'https://images.unsplash.com/photo-1525926477800-7a3b10316ac6?w=800&q=80', desc: 'A fun, quirky cartoonification of your favorite photo. Bold outlines, flat bright colors, and expressive features make this perfect as a gift.', rating: 4.6 },
    { id: 6, title: 'Graphite Gaze', artistId: 'usr-2', style: 'Sketch', price: 550, img: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80', desc: 'A minimalist pencil sketch focusing primarily on the profound expression in the eyes of the subject. A stunning display of cross-hatching technique.', rating: 5 },
    { id: 7, title: 'Pop Art Portrait', artistId: 'usr-3', style: 'Digital', price: 850, img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80', desc: 'A classic Andy Warhol inspired pop art piece. High contrast shading combined with an explosion of eccentric retro colors.', rating: 4.8 },
    { id: 8, title: 'The Royal Treatment', artistId: 'usr-4', style: 'Realistic', price: 2000, img: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=800&q=80', desc: 'A highly complex, fully painted Renaissance-style portrait. Your subject is rendered in the attire of old royalty with unmatched attention to fabric folds and lighting.', rating: 4.9 }
  ],
  orders: [
    { id: 'ORD-1001', type: 'Direct', status: 'Completed', date: '2026-03-20', artId: 1, artist: 'Priya Sharma', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80', title: 'Neon Dreams', price: 800, progress: 100 },
    { id: 'ORD-1002', type: 'Custom', status: 'Pending', date: '2026-03-26', style: 'Realistic', subjects: '2 People', bg: 'Detailed Scene', notes: 'Make it romantic.', price: 1800, progress: 0, img: '', title: 'Custom Portrait', artist: 'Dev Patel' },
    { id: 'ORD-1003', type: 'Custom', status: 'In Progress', date: '2026-03-24', style: 'Digital', subjects: '1 Person', bg: 'Plain White', notes: 'Profile pic.', price: 800, progress: 50, img: '', title: 'Custom Avatar', artist: 'Priya Sharma' }
  ],
  forum: [
    { id: 1, title: 'Tips for pricing custom sketches?', user: 'Rahul Verma', time: '2 hours ago', content: 'What factors do you consider when pricing your pencil work? Do you charge by hour or size?', img: '', upvotes: 45, comments: 12, type: 'hot' },
    { id: 2, title: 'WIP: Cyberpunk Cityscape', user: 'Priya Sharma', time: '5 hours ago', content: 'Almost done with my largest canvas yet! Any feedback on the lighting?', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80', upvotes: 156, comments: 32, type: 'hot' },
    { id: 3, title: 'Critique my anatomy proportions', user: 'David W.', time: '1 day ago', content: 'Trying to get better at drawing from imagination. Something feels off about the arms.', img: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?w=800&q=80', upvotes: 12, comments: 8, type: 'critique' }
  ]
};

function lsRead(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function lsWrite(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function initLocalDB() {
  Object.keys(LS_KEYS).forEach(collection => {
    if (!lsRead(LS_KEYS[collection])) {
      lsWrite(LS_KEYS[collection], SEED_DATA[collection]);
    }
  });
  console.log('LocalStorage DB initialized.');
}

function mapGalleryWithArtist(rawGallery, users) {
  return rawGallery.map(item => {
    const artistUser = users.find(u => u.id === item.artistId);
    return { ...item, artist: artistUser ? artistUser.name : 'Unknown Artist' };
  });
}

let dbUsers = [];
let galleryData = [];
let artistsData = [];
let myOrders = [];
let forumData = [];

function getDbUsers() {
    return dbUsers;
}

function loadAppDataFromLocalStorage() {
  initLocalDB();
  const users = lsRead(LS_KEYS.users) || [];
  const rawGallery = lsRead(LS_KEYS.gallery) || [];
  dbUsers = users.map(({ pass, ...safe }) => safe);
  galleryData = mapGalleryWithArtist(rawGallery, users);
  myOrders = lsRead(LS_KEYS.orders) || [];
  forumData = lsRead(LS_KEYS.forum) || [];
  artistsData = buildArtistsData();
}

function refreshGalleryData() {
  const users = lsRead(LS_KEYS.users) || [];
  const rawGallery = lsRead(LS_KEYS.gallery) || [];
  galleryData = mapGalleryWithArtist(rawGallery, users);
  artistsData = buildArtistsData();
}

function refreshOrdersData() {
  myOrders = lsRead(LS_KEYS.orders) || [];
}

function refreshForumData() {
  forumData = lsRead(LS_KEYS.forum) || [];
}

// ==========================================
// ROLE-BASED AUTHENTICATION & LOCAL DB
// ==========================================

function toggleLoginModal() { 
    document.getElementById('loginModal').classList.toggle('flex'); 
    switchAuthTab('login');
}

function selectLoginRole(role) {
   document.querySelectorAll('.role-radio').forEach(r => r.classList.remove('active'));
   if(role === 'customer') document.getElementById('lblRoleCustomer').classList.add('active');
   if(role === 'artist') document.getElementById('lblRoleArtist').classList.add('active');
}

let currentMode = 'login';
function switchAuthTab(mode) {
    currentMode = mode;
    document.querySelectorAll('#loginModal .filter-bar .btn-filter').forEach(b => b.classList.remove('active'));
    document.getElementById(mode === 'login' ? 'authTabLogin' : 'authTabRegister').classList.add('active');
    
    if(mode === 'register') {
        document.getElementById('authRegisterFields').style.display = 'block';
        document.getElementById('authModalTitle').textContent = 'Create Account';
        document.getElementById('authModalDesc').textContent = 'Join Artify to discover and request amazing art.';
        document.getElementById('authSubmitBtn').textContent = 'Sign Up Securely';
    } else {
        document.getElementById('authRegisterFields').style.display = 'none';
        document.getElementById('authModalTitle').textContent = 'Welcome Back';
        document.getElementById('authModalDesc').textContent = 'Sign in to securely access your portal.';
        document.getElementById('authSubmitBtn').textContent = 'Secure Log In';
    }
}

function handleAuthSubmit() {
    const email = document.getElementById('authEmail').value.trim();
    const pass = document.getElementById('authPassword').value.trim();
    
    if(!email || !pass) { showToast('Please enter email and password.'); return; }

    const users = lsRead(LS_KEYS.users) || [];

    if(currentMode === 'login') {
        const user = users.find(u => u.email === email && u.pass === pass);
        if(!user) { showToast('Invalid credentials.'); return; }
        const { pass: _p, ...safeUser } = user;
        loginUser(safeUser);
    } else {
        const name = document.getElementById('authName').value.trim();
        if(!name) { showToast('Please enter your full name.'); return; }
        if(users.some(u => u.email === email)) { showToast('Email already in use.'); return; }

        let selectedRole = 'customer';
        const radios = document.getElementsByName('roleSelect');
        for (let r of radios) { if(r.checked) selectedRole = r.value; }

        const newUser = { id: 'usr-' + Date.now(), name, email, pass, role: selectedRole === 'artist' ? 'artist' : 'customer' };
        users.push(newUser);
        lsWrite(LS_KEYS.users, users);
        const { pass: _p, ...safeUser } = newUser;
        loginUser(safeUser);
    }

    dbUsers = (lsRead(LS_KEYS.users) || []).map(({ pass: _p, ...safe }) => safe);
    artistsData = buildArtistsData();
}

function loginUser(user) {
    currentUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    localStorage.setItem('artifyUser', JSON.stringify(currentUser));
    
    // Clear forms
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
    document.getElementById('authName').value = '';
    
    updateAuthUI();
    document.getElementById('loginModal').classList.remove('flex');
    showToast('Logged in as ' + user.name);
    
    if(user.role === 'artist') {
        navigateTo('view-artist-home');
    } else {
        document.getElementById('heroGuest').style.display = 'none';
        if(document.getElementById('hubWelcomeText')) document.getElementById('hubWelcomeText').textContent = 'Welcome back, ' + user.name.split(' ')[0] + '.';
        renderGalleryHub('all');
        renderDiscoveryArtists();
        renderCommunityFeed();
        switchCustomerTab('artworks');
        navigateTo('view-customer-hub');
    }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('artifyUser');
  updateAuthUI();
  closeDropdown();
  window.location.reload();
}

function updateAuthUI() {
  if (currentUser) {
    document.getElementById('loginBtnNav').style.display = 'none';
    document.getElementById('userMenuWrapper').style.display = 'block';
    
    // Setup Navigation visibility based on Role
    if (currentUser.role === 'customer') {
       document.getElementById('navCustomerLinks').style.display = 'flex';
       document.getElementById('navArtistLinks').style.display = 'none';
       document.getElementById('ddCustomerOnly').style.display = 'block';
       document.getElementById('ddArtistOnly').style.display = 'none';
    } else {
       document.getElementById('navCustomerLinks').style.display = 'none';
       document.getElementById('navArtistLinks').style.display = 'flex';
       document.getElementById('ddCustomerOnly').style.display = 'none';
       document.getElementById('ddArtistOnly').style.display = 'block';
    }

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=E5C158&color=141414&size=128`;
    document.getElementById('navAvatarImg').src = avatarUrl;
    document.getElementById('sidebarAvatar').src = avatarUrl;
    document.getElementById('sidebarName').textContent = currentUser.name;
    document.getElementById('sidebarRoleBadge').innerHTML = `<span class="badge" style="background:var(--bg-alt); color:var(--text-primary); border:1px solid var(--accent);">${currentUser.role.toUpperCase()}</span>`;
    document.getElementById('profNameInput').value = currentUser.name;
    document.getElementById('profEmailInput').value = currentUser.email;

  } else {
    document.getElementById('loginBtnNav').style.display = 'block';
    document.getElementById('userMenuWrapper').style.display = 'none';
    document.getElementById('navCustomerLinks').style.display = 'flex';
    document.getElementById('navArtistLinks').style.display = 'none';
    document.getElementById('sidebarAvatar').src = 'https://ui-avatars.com/api/?name=User&background=E5C158&color=141414';
    document.getElementById('sidebarName').textContent = 'Guest User';
  }
}

function saveProfileInfo() {
  const newName = document.getElementById('profNameInput').value;
  if(newName && currentUser) {
    currentUser.name = newName;
    localStorage.setItem('artifyUser', JSON.stringify(currentUser));
    updateAuthUI(); showToast('Profile updated!');
  }
}

function toggleDropdown() { document.getElementById('profileDropdown').classList.toggle('active'); }
function closeDropdown() { document.getElementById('profileDropdown').classList.remove('active'); }
document.addEventListener('click', (e) => { if(!e.target.closest('#userMenuWrapper')) closeDropdown(); });

// Profile Tabs 
function switchProfileTab(tabId) {
  document.querySelectorAll('.profile-sidebar-nav .nav-tab').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`ptab-${tabId}`).classList.add('active');
  document.querySelectorAll('.profile-content .tab-pane').forEach(pane => pane.classList.remove('active'));
  document.getElementById(`pane-${tabId}`).classList.add('active');
}

// Addresses
let savedAddresses = JSON.parse(localStorage.getItem('artifyAddresses') || '[]');
function renderAddresses() {
  const list = document.getElementById('addressesList');
  if(!list) return;
  list.innerHTML = '';
  if(savedAddresses.length === 0) list.innerHTML = '<p class="text-muted col-span-2">No addresses saved yet.</p>';
  savedAddresses.forEach((adr, idx) => {
    list.innerHTML += `
      <div class="card bg-alt p-3 border-radius mb-2 border-l-accent" style="border-left-color: ${idx===0 ? 'var(--accent)' : 'var(--border)'}">
         <h4 class="mb-1">${adr.name} ${idx===0 ? '<span class="badge ml-2" style="background:#10b981;">Default</span>' : ''}</h4>
         <p class="text-sm text-muted mb-1">${adr.full}, ${adr.city} - ${adr.pin}</p>
         <p class="text-sm text-muted m-0">📞 ${adr.phone}</p>
      </div>`;
  });
}
function saveNewAddress() {
  const name = document.getElementById('addrName').value, phone = document.getElementById('addrPhone').value, full = document.getElementById('addrFull').value, city = document.getElementById('addrCity').value, pin = document.getElementById('addrPin').value;
  if(!name || !full || !city) { showToast('Fill all fields.'); return; }
  savedAddresses.push({ name, phone, full, city, pin });
  localStorage.setItem('artifyAddresses', JSON.stringify(savedAddresses));
  document.getElementById('addAddressForm').style.display = 'none';
  document.getElementById('addrName').value = ''; document.getElementById('addrFull').value = ''; document.getElementById('addrCity').value = '';
  renderAddresses(); showToast('Address added!');
}


// ==========================================
// DATA MODELS (LocalStorage DB)
// ==========================================

function buildArtistsData() {
    const users = getDbUsers().filter(u => u.role === 'artist');
    return users.map(u => ({
            id: u.id,
            name: u.name,
            style: galleryData.find(g => g.artistId === u.id)?.style || 'Mixed Media',
            img: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff`,
            desc: 'Professional artist delivering museum-quality results. Passionate about capturing raw emotion and translating concepts into breathtaking visual realities.',
            rating: 4.8,
            revCount: 50,
            yearsExperience: 5,
            totalArtworks: galleryData.filter(g => g.artistId === u.id).length + 20,
            reviews: [
                    { user: 'Sarah J.', rating: 5, comment: 'Absolutely stunning work! Captured the essence perfectly.', date: '2 days ago' }
            ]
    }));
}

function saveOrders() {
    lsWrite(LS_KEYS.orders, myOrders);
}

let orderChats = JSON.parse(localStorage.getItem('artifyChats'));
if(!orderChats) {
  orderChats = {};
  localStorage.setItem('artifyChats', JSON.stringify(orderChats));
}
function saveOrderChats() { localStorage.setItem('artifyChats', JSON.stringify(orderChats)); }

let currentActiveOrderId = null;

// ==========================================
// CHECKOUT & PAYMENTS
// ==========================================
let checkoutCart = null;

function processDirectOrderCheckout() {
  const qty = parseInt(document.getElementById('confDirectQty').value || 1);
  const total = currentViewedArtwork.price * qty;
  checkoutCart = {
     type: 'Direct',
     itemTitle: currentViewedArtwork.title,
     artist: currentViewedArtwork.artist,
     img: currentViewedArtwork.img,
     price: total,
     artId: currentViewedArtwork.id
  };
  navigateTo('view-checkout');
}

function processCustomOrderCheckout() {
  const total = parseInt(document.getElementById('confCustPrice').textContent.replace('₹',''));
  const style = document.getElementById('confCustStyle').textContent;
  
  // Connect to the actual profile if we navigated from one
  const notesStr = document.getElementById('confCustNotes').textContent || '';
  let artistTarget = 'Assigned Later';
  if(notesStr.includes('Commissioning ')) {
      artistTarget = notesStr.split('Commissioning ')[1].split(':')[0];
  }

  checkoutCart = {
     type: 'Custom',
     itemTitle: 'Custom ' + style + ' Request',
     artist: artistTarget,
     img: '',
     styleInit: style.charAt(0),
     price: total,
     customMeta: {
        style: style, subjects: document.getElementById('confCustSubj').textContent,
        bg: document.getElementById('confCustBg').textContent, notes: notesStr
     }
  };
  navigateTo('view-checkout');
}

function checkoutBack() { checkoutCart = null; window.history.back(); }

function populateCheckout() {
   if(!checkoutCart) return;
   if(checkoutCart.type === 'Direct') {
      document.getElementById('chkImg').src = checkoutCart.img;
      document.getElementById('chkImg').style.display = 'block';
      document.getElementById('chkInitials').style.display = 'none';
   } else {
      document.getElementById('chkInitials').textContent = checkoutCart.styleInit;
      document.getElementById('chkInitials').style.display = 'flex';
      document.getElementById('chkImg').style.display = 'none';
   }
   document.getElementById('chkTitle').textContent = checkoutCart.itemTitle;
   document.getElementById('chkType').textContent = checkoutCart.type + ' Order • ' + checkoutCart.artist;
   document.getElementById('chkPrice').textContent = '₹' + checkoutCart.price;
   document.getElementById('chkBtnPrice').textContent = '₹' + checkoutCart.price;

   const addrSel = document.getElementById('chkAddress');
   addrSel.innerHTML = '<option value="">Select Delivery Address</option>';
   savedAddresses.forEach((a, i) => { addrSel.innerHTML += `<option value="${i}">${a.full}, ${a.city}</option>`; });
   if(savedAddresses.length > 0) addrSel.selectedIndex = 1;
}

function selectPayMethod(method) {
   document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
   document.getElementById('payFormCard').style.display = 'none';
   document.getElementById('payFormUpi').style.display = 'none';
   document.getElementById('payFormNb').style.display = 'none';

   if(method === 'card') {
      document.getElementById('payMethodCard').classList.add('active');
      document.getElementById('payFormCard').style.display = 'block';
   } else if (method === 'upi') {
      document.getElementById('payMethodUpi').classList.add('active');
      document.getElementById('payFormUpi').style.display = 'block';
   } else {
      document.getElementById('payMethodNb').classList.add('active');
      document.getElementById('payFormNb').style.display = 'block';
   }
}

function confirmPaymentAndOrder() {
   if(!checkoutCart) return;

   // Validation
   const addressSelect = document.getElementById('chkAddress');
   if(!addressSelect.value) {
       showToast('Please select a delivery address.');
       return;
   }

   const payMethod = document.querySelector('.pay-method.active').id;
   if(payMethod === 'payMethodCard') {
       if(!document.getElementById('chkCardNum').value || !document.getElementById('chkCardExp').value || !document.getElementById('chkCardCvv').value || !document.getElementById('chkCardName').value) {
           showToast('Please fill in all card details.');
           return;
       }
   } else if(payMethod === 'payMethodUpi') {
       if(!document.getElementById('chkUpiId').value) {
           showToast('Please enter your UPI ID.');
           return;
       }
   }
   
   const newId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
   const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
   
   let newOrder = {
      id: newId, type: checkoutCart.type, status: checkoutCart.type==='Direct'?'Completed':'Pending', progress: checkoutCart.type==='Direct'?100:0,
      date: dateStr, title: checkoutCart.itemTitle, artist: checkoutCart.artist, price: checkoutCart.price
   };

   if(checkoutCart.type === 'Direct') {
      newOrder.artId = checkoutCart.artId;
      newOrder.img = checkoutCart.img;
   } else {
      newOrder.img = ''; newOrder.style = checkoutCart.customMeta.style;
      newOrder.subjects = checkoutCart.customMeta.subjects; newOrder.bg = checkoutCart.customMeta.bg;
      newOrder.notes = checkoutCart.customMeta.notes;
      if(newOrder.artist === 'Assigned Later') {
         const matchedArtist = artistsData.find(a => a.style === newOrder.style);
         if(matchedArtist) newOrder.artist = matchedArtist.name;
      }
   }

   const orders = lsRead(LS_KEYS.orders) || [];
   orders.unshift(newOrder);
   lsWrite(LS_KEYS.orders, orders);
   refreshOrdersData();
   
   // Populate Success
   document.getElementById('succArtist').textContent = newOrder.artist;
   document.getElementById('succOrdId').textContent = '#' + newId;
   document.getElementById('succAmt').textContent = '₹' + checkoutCart.price;
   
   // Populate Invoice globally just in case
   if(document.getElementById('invItem')) {
      document.getElementById('invItem').textContent = newOrder.title;
      document.getElementById('invPrice').textContent = '₹' + newOrder.price;
      document.getElementById('invDate').textContent = dateStr;
      document.getElementById('invName').textContent = currentUser ? currentUser.name : 'Guest User';
   }

   renderOrdersList('All');
   showToast('Payment Processed Successfully!');
   checkoutCart = null;
   navigateTo('view-payment-success');
}


// ==========================================
// ARTIST PORTAL
// ==========================================
function renderArtistDashboard() {
   if(!currentUser || currentUser.role !== 'artist') return;
   const artistName = currentUser.name;
   
   // Calculate stats based on myOrders where artist matches
   const myCommissions = myOrders.filter(o => o.artist === artistName);
   const totalVal = myCommissions.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.price, 0) + 40000; // adding baseline dummy
   const pendingCount = myCommissions.filter(o => o.status === 'Pending').length;

   document.getElementById('artistWelcome').textContent = 'Artist Portal: ' + artistName;
   document.getElementById('artistStatTotal').textContent = myCommissions.length + 30; // base offset
   document.getElementById('artistStatPending').textContent = pendingCount;
   document.getElementById('artistStatEarnings').textContent = '₹' + totalVal.toLocaleString();

   const rec = document.getElementById('artistRecentActivity');
   rec.innerHTML = '';
   myCommissions.slice(0,3).forEach(c => {
      rec.innerHTML += `<div class="p-2 border-bottom flex-between text-sm"><span><strong>${c.id}</strong> - ${c.title}</span><span class="badge badge-secondary">${c.status}</span></div>`;
   });
}

function renderArtistCommissions() {
   if(!currentUser || currentUser.role !== 'artist') return;
   const pend = document.getElementById('artistPendingList');
   const actv = document.getElementById('artistActiveList');
   pend.innerHTML = ''; actv.innerHTML = '';

   const comms = myOrders.filter(o => o.artist === currentUser.name && o.type === 'Custom');
   
   comms.forEach(c => {
      let card = `<div class="card p-4 border-l-accent box-shadow-xl" id="artistCommCard-${c.id}">
         <div class="flex-between mb-2"><h4>${c.id}</h4><strong class="text-accent">₹${c.price}</strong></div>
         <p class="text-sm m-0"><strong>Style:</strong> ${c.style}</p>
         <p class="text-sm m-0"><strong>Subjects:</strong> ${c.subjects}</p>
         <p class="text-sm text-muted mt-2">${c.notes || 'No special notes.'}</p>
         <hr class="my-3 border-subtle">`;
      
      if(c.status === 'Pending') {
         card += `<div class="flex-gap"><button class="btn-primary flex-1" onclick="updateOrderStatus('${c.id}', 'In Progress', 50)">Accept</button><button class="btn-secondary flex-1 text-danger" onclick="updateOrderStatus('${c.id}', 'Rejected', 0)">Reject</button></div></div>`;
         pend.innerHTML += card;
      } else if (c.status === 'In Progress') {
         card += `<div class="flex-between align-center mb-2">
             <span class="badge" style="background:#f59e0b">In Progress</span>
             <button class="btn-outline sm" onclick="updateOrderStatus('${c.id}', 'Completed', 100)">Mark Completed</button>
           </div>
           <button class="btn-primary w-100 mt-2" onclick="openOrderDetails('${c.id}')"><span style="color:#fff;">💬</span> Project Workspace</button>
           </div>`;
         actv.innerHTML += card;
      } else {
         card += `<div class="badge mb-2" style="background:#10b981;">Completed</div>
                <button class="btn-outline w-100 mt-2" onclick="openOrderDetails('${c.id}')">View Project History</button>
             </div>`;
         actv.innerHTML += card;
      }
   });
   if(pend.innerHTML==='') pend.innerHTML = '<p class="text-muted col-span-2">No pending requests.</p>';
   if(actv.innerHTML==='') actv.innerHTML = '<p class="text-muted col-span-2">No active items.</p>';
}

function updateOrderStatus(id, newStatus, prog) {
   let o = myOrders.find(x => x.id === id);
   if(o) {
      o.status = newStatus;
      o.progress = prog;
      const orders = lsRead(LS_KEYS.orders) || [];
      const stored = orders.find(x => x.id === id);
      if(stored) { stored.status = newStatus; stored.progress = prog; }
      lsWrite(LS_KEYS.orders, orders);
      showToast('Status updated to: ' + newStatus);
      renderArtistCommissions();
   }
}

// Artist Upload
let tempArtFileSrc = '';
function handleNewArtFile(input) {
   if (input.files && input.files[0]) {
       const reader = new FileReader();
       reader.onload = function(e) {
           const img = new Image();
           img.onload = function() {
               const canvas = document.createElement('canvas');
               let w = img.width;
               let h = img.height;
               const maxDim = 800; // compress dimension prevents localStorage bloat crash
               if (w > h && w > maxDim) { h *= maxDim / w; w = maxDim; } 
               else if (h > maxDim) { w *= maxDim / h; h = maxDim; }
               canvas.width = w; canvas.height = h;
               const ctx = canvas.getContext('2d');
               ctx.drawImage(img, 0, 0, w, h);
               tempArtFileSrc = canvas.toDataURL('image/jpeg', 0.6); // aggressively compress
               
               document.getElementById('upArtFileLabel').textContent = '✓ Image Loaded (Optimized)';
               document.querySelector('.file-drop').style.backgroundImage = `url(${tempArtFileSrc})`;
               document.querySelector('.file-drop').style.backgroundSize = 'cover';
               document.querySelector('.file-drop').style.color = 'transparent';
               document.querySelector('.file-drop .text-4xl').style.display = 'none';
           };
           img.src = e.target.result;
       };
       reader.readAsDataURL(input.files[0]);
   }
}

function submitArtistArtwork() {
   const t = document.getElementById('upArtTitle').value;
   const s = document.getElementById('upArtStyle').value;
   const p = document.getElementById('upArtPrice').value;
   const d = document.getElementById('upArtDesc').value;
   
   if(!t || !p || !tempArtFileSrc) { showToast('Please fill title, price, and add an image.'); return; }

   const rawGallery = lsRead(LS_KEYS.gallery) || [];
   rawGallery.push({ id: Date.now(), title: t, artistId: currentUser.id, style: s, price: parseInt(p, 10), desc: d, img: tempArtFileSrc, rating: 5.0 });
   lsWrite(LS_KEYS.gallery, rawGallery);
   refreshGalleryData();
   
   showToast('Artwork successfully added to marketplace!');
   
   // Reset
   document.getElementById('upArtTitle').value=''; document.getElementById('upArtPrice').value='';
   document.getElementById('upArtDesc').value='';
   document.querySelector('.file-drop').style.backgroundImage = 'none';
   document.querySelector('.file-drop').style.color = 'inherit';
   document.querySelector('.file-drop .text-4xl').style.display = 'block';
   document.getElementById('upArtFileLabel').textContent = 'Click or drag image here';
   tempArtFileSrc = '';
}


// ... [KEEP ALL EXISTING DIRECT/CUSTOM/DASHBOARD FUNCTIONS THE SAME - THEY WERE JUST OVERWRITTEN SO I MUST INCLUDE THEM] ...

// CORE GALLERY & COMPARISON
let compareList = [];

function toggleCompare(artId) {
    const idx = compareList.indexOf(artId);
    if(idx > -1) {
        compareList.splice(idx, 1);
        showToast("Removed from comparison.");
    } else {
        if(compareList.length >= 2) {
            showToast("You can only compare 2 artworks at a time. Showing comparison...");
            openCompareModal();
            return;
        }
        compareList.push(artId);
        showToast(`Added to comparison (${compareList.length}/2)`);
        if(compareList.length === 2) {
            openCompareModal();
        }
    }
}

function openCompareModal() {
    if(compareList.length < 2) {
        showToast("Select 2 artworks to compare.");
        return;
    }
    const art1 = galleryData.find(a => a.id === compareList[0]);
    const art2 = galleryData.find(a => a.id === compareList[1]);
    
    let modal = document.getElementById('compareModal');
    if(!modal) {
        modal = document.createElement('div');
        modal.id = 'compareModal';
        modal.className = 'overlay flex flex-column justify-center align-center';
        modal.style.zIndex = '9999';
        modal.style.position = 'fixed';
        modal.style.top = '0'; modal.style.left = '0'; modal.style.width = '100vw'; modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.8)';
        modal.style.backdropFilter = 'blur(10px)';
        document.body.appendChild(modal);
    }
    
    // Evaluate best choice (mock heuristic: higher rating/price ratio + absolute rating weight)
    const art1Score = (art1.rating || 0) * 10 - (art1.price || 0) * 0.01;
    const art2Score = (art2.rating || 0) * 10 - (art2.price || 0) * 0.01;
    const bestChoice = art1Score > art2Score ? art1.id : art2.id;

    modal.innerHTML = `
        <div class="card p-4 mx-auto" style="max-width:1000px; width:95%; max-height: 90vh; overflow-y: auto; position:relative; background:var(--bg-secondary);">
            <button onclick="document.getElementById('compareModal').style.display='none'; compareList=[]; showToast('Comparison cleared.');" 
                    style="position:absolute; top:1rem; right:1.5rem; background:none; border:none; font-size:1.5rem; font-weight:bold; cursor:pointer; color:var(--text-primary); z-index:10;">✕</button>
            <h2 class="text-center mb-4"><span style="color:var(--accent);">Art</span> Comparison</h2>
            <div class="flex gap-3 comparison-container" style="align-items:stretch; flex-wrap: wrap;">
                ${[art1, art2].map(art => `
                <div style="flex:1; min-width: 300px; border: 2px solid ${bestChoice === art.id ? 'var(--accent)' : 'var(--border)'}; border-radius:var(--radius); padding:1.5rem; position:relative; background:var(--bg-primary);">
                    ${bestChoice === art.id ? '<div class="badge" style="position:absolute; top:1rem; left:1rem; background:var(--accent); color:#fff; z-index:10; font-weight:bold; padding: 0.5rem 1rem;">🏆 Best Choice</div>' : ''}
                    <img src="${art.img}" style="width:100%; height:300px; object-fit:cover; border-radius:calc(var(--radius) - 8px); margin-bottom:1.5rem;" />
                    <h3 class="mb-1">${art.title}</h3>
                    <p class="text-sm text-muted mb-3">By <b class="text-primary">${art.artist}</b></p>
                    
                    <div style="display:flex; justify-content:space-between; margin-bottom:.75rem; border-bottom:1px solid var(--border); padding-bottom:.75rem;">
                        <span class="text-muted">Style</span>
                        <strong>${art.style}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:.75rem; border-bottom:1px solid var(--border); padding-bottom:.75rem;">
                        <span class="text-muted">Price</span>
                        <strong class="text-accent font-bold" style="font-size: 1.2rem;">₹${art.price}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:.75rem;">
                        <span class="text-muted">Rating</span>
                        <strong class="text-secondary font-bold">⭐ ${art.rating || 4.8} / 5.0</strong>
                    </div>
                    
                    <p class="text-sm mb-4 text-muted" style="min-height: 60px;">${art.desc}</p>
                    
                    <button class="btn-primary w-100" style="padding: 1rem;" onclick="document.getElementById('compareModal').style.display='none'; openArtworkDetails(${art.id})">View Details</button>
                    <button class="btn-secondary w-100 mt-2" onclick="initiateCheckout(${art.id}); document.getElementById('compareModal').style.display='none';">Buy Now</button>
                </div>
                `).join('')}
            </div>
            
            <!-- Recommendations based on comparison -->
             <div class="mt-5 p-4" style="background:var(--bg-alt); border-radius:var(--radius);">
                 <h4 class="mb-3">✨ Smart Insights</h4>
                 <p class="text-sm text-muted mb-2">Based on your selection, <b>${bestChoice === art1.id ? art1.title : art2.title}</b> offers a better overall value considering the rating-to-price ratio. It's a fantastic fit for ${art1.style === art2.style ? art1.style.toLowerCase() : 'this artistic style'} lovers.</p>
             </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function renderGallery(filter = 'all') {
  const container = document.getElementById('galleryContainer');
  if(!container) return;
  container.innerHTML = '';
  galleryData.filter(item => filter === 'all' || item.style.includes(filter)).forEach(item => {
    container.innerHTML += `
      <div class="card gallery-card">
        <img src="${item.img}" class="gallery-img">
        <div class="gallery-hover-actions">
           <button class="btn-primary" onclick="openArtworkDetails(${item.id})">View Details</button>
           <button class="btn-secondary" style="background:rgba(255,255,255,0.2); color:#fff; border-color:rgba(255,255,255,0.5);" onclick="toggleCompare(${item.id})">⚖️ Compare</button>
           <button class="btn-secondary" onclick="toggleWishlist(${item.id})">Add to Wishlist</button>
        </div>
        <div class="gallery-info"><div><h4>${item.title}</h4><p class="text-sm text-muted artist-link m-0" onclick="openArtistDetails('${item.artist}')">${item.style} • ${item.artist}</p></div><div class="text-right"><span class="text-accent font-bold block">₹${item.price}</span><span class="text-xs text-secondary font-bold">★ ${item.rating}</span></div></div>
      </div>`;
  });
}
function filterGallery(style, btnEl) { document.querySelectorAll('.filter-bar:first-of-type .btn-filter').forEach(btn => btn.classList.remove('active')); if(btnEl) btnEl.classList.add('active'); renderGallery(style); }
function searchGallery(q) { q=q.toLowerCase(); const container = document.getElementById('galleryContainer'); container.innerHTML = ''; galleryData.filter(i => i.title.toLowerCase().includes(q) || i.artist.toLowerCase().includes(q) || i.style.toLowerCase().includes(q)).forEach(item => { container.innerHTML += `<div class="card gallery-card"><img src="${item.img}" class="gallery-img"><div class="gallery-hover-actions"><button class="btn-primary" onclick="openArtworkDetails(${item.id})">View Details</button><button class="btn-secondary" style="background:rgba(255,255,255,0.2); color:#fff; border-color:rgba(255,255,255,0.5);" onclick="toggleCompare(${item.id})">⚖️ Compare</button><button class="btn-secondary" onclick="toggleWishlist(${item.id})">Add to Wishlist</button></div><div class="gallery-info"><div><h4>${item.title}</h4><p class="text-sm text-muted artist-link m-0" onclick="openArtistDetails('${item.artist}')">${item.style} • ${item.artist}</p></div><div class="text-right"><span class="text-accent font-bold block">₹${item.price}</span><span class="text-xs text-secondary font-bold">★ ${item.rating}</span></div></div></div>`; }); }

// DETAILS
let currentViewedArtwork = null;
function openArtworkDetails(id) {
  const art = galleryData.find(a => a.id === id); if(!art) return; currentViewedArtwork = art;
  document.getElementById('detailArtImg').src = art.img; document.getElementById('detailArtStyle').textContent = art.style;
  document.getElementById('detailArtTitle').textContent = art.title; document.getElementById('detailArtDesc').textContent = art.desc;
  document.getElementById('detailArtPrice').textContent = '₹' + art.price;
  
  if(document.getElementById('detailArtRating')) document.getElementById('detailArtRating').textContent = art.rating;

  if(document.getElementById('detailArtSuitable')) document.getElementById('detailArtSuitable').textContent = art.style === 'Digital' ? 'Avatars, Social Media' : (art.style === 'Realistic' ? 'Living Room, Gifts' : 'Decor, Gifts');
  if(document.getElementById('detailArtDelivery')) document.getElementById('detailArtDelivery').textContent = art.style === 'Digital' ? '1-2 Days' : '5-7 Days (Physical Draft)';
  if(document.getElementById('detailArtDim')) document.getElementById('detailArtDim').textContent = art.style === 'Digital' ? '300 DPI, High-Res' : '16x20 inches Canvas';

  const artist = artistsData.find(a => a.name === art.artist); document.getElementById('detailArtArtistImg').src = artist ? artist.img : art.img; document.getElementById('detailArtArtistName').textContent = art.artist;
  
  // Render Artwork Reviews
  renderArtworkReviews();
  switchArtProductTab('desc'); // default tab
  
  navigateTo('view-artwork-details');
}

// ARTWORK SPECIFIC TABS & REVIEWS
function switchArtProductTab(tab) {
   document.querySelectorAll('.art-product-tab').forEach(p => p.style.display = 'none');
   document.getElementById(`artProductTab-${tab}`).style.display = 'block';
   document.querySelectorAll('#view-artwork-details .btn-filter').forEach(b => { b.classList.remove('active'); b.style.borderBottom = 'none'; });
   const act = document.getElementById(`aptab-${tab}`);
   if(act) { act.classList.add('active'); act.style.borderBottom = '3px solid var(--accent)'; }
}

function renderArtworkReviews() {
   const cont = document.getElementById('artProductReviewsList');
   if(!cont) return;
   cont.innerHTML = '';
   
   // Pull generic reviews from artist but pretend they are for this artwork for prototype
   const artist = artistsData.find(a => a.name === currentViewedArtwork.artist);
   let revs = (artist && artist.reviews) ? artist.reviews.slice(0, 3) : []; // Show just 3 relevant ones
   
   if(document.getElementById('artRevCountBadge')) document.getElementById('artRevCountBadge').textContent = revs.length;
   
   if(revs.length === 0) {
      cont.innerHTML = '<p class="text-muted bg-alt p-4 border-radius text-center">No reviews for this specific piece yet. Be the first!</p>';
   } else {
      revs.forEach(r => {
         let stars = '★'.repeat(r.rating) + '☆'.repeat(5-r.rating);
         cont.innerHTML += `
         <div class="review-card p-3 border-radius mb-2 bg-primary box-shadow-sm flex gap-3 align-start" style="border-left: 3px solid var(--accent);">
             <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(r.user)}&background=random&color=fff" class="avatar-small">
             <div>
                 <div class="stars text-secondary mb-1">${stars}</div>
                 <h4 class="m-0">${r.user} <span class="text-muted text-sm font-normal ml-2">${r.date}</span></h4>
                 <p class="text-muted mt-2 mb-0">"${r.comment}"</p>
             </div>
         </div>`;
      });
   }
}

function openArtReviewModal() {
   if (!currentUser) {
      showToast('Please login to review.');
      return;
   }
   
   // Determine if we are on artist page or artwork page
   let targetArtist = null;
   if (document.getElementById('view-artist-details').classList.contains('active')) {
      targetArtist = document.getElementById('detailArtistName').textContent;
   } else if (currentViewedArtwork) {
      targetArtist = currentViewedArtwork.artist;
   }
   
   if (!targetArtist) {
      showToast('Could not identify artist.');
      return;
   }
   
   openReviewModal(null, targetArtist);
}

function openArtistDetailsFromArtwork() { if(currentViewedArtwork) openArtistDetails(currentViewedArtwork.artist); }
function commissionFromArtwork() {
  if(!currentViewedArtwork) return;
  document.getElementById('reqStyle').value = currentViewedArtwork.style === 'Pencil Sketch' ? 'Sketch' : currentViewedArtwork.style;
  document.getElementById('reqNotes').value = `I want a custom version similar to your '${currentViewedArtwork.title}' artwork.\n\n`;
  updatePreview(); navigateTo('view-commission');
}
function processDirectOrderCheckoutQuick(id) {
  const art = galleryData.find(a => a.id === id); if(!art) return;
  checkoutCart = { type: 'Direct', itemTitle: art.title, artist: art.artist, img: art.img, price: art.price, artId: art.id };
  navigateTo('view-checkout');
}

function goToDirectConfirmation() {
  if(!currentViewedArtwork) return;
  document.getElementById('confDirectImg').src = currentViewedArtwork.img; document.getElementById('confDirectTitle').textContent = currentViewedArtwork.title;
  document.getElementById('confDirectArtist').textContent = currentViewedArtwork.artist; document.getElementById('confDirectQty').value = 1; updateDirectTotal();
  navigateTo('view-direct-confirmation');
}
function updateDirectTotal() { const qty = document.getElementById('confDirectQty').value; const t = currentViewedArtwork.price * qty; document.getElementById('confDirectTotal').textContent = '₹' + t; return t; }

// WIZARD
function updatePreview() {
  const subjEl = document.getElementById('reqSubjects'); if(!subjEl) return 800;
  document.getElementById('pvSubj').textContent = subjEl.options[subjEl.selectedIndex].text;
  const style = document.getElementById('reqStyle').value; document.getElementById('pvStyle').textContent = style;
  document.getElementById('pvBg').textContent = document.getElementById('reqBg').value;
  document.getElementById('pvNotes').textContent = document.getElementById('reqNotes').value || '—';
  let b = 800; if(style === 'Sketch') b = 600; if(style === 'Cartoon') b = 500; if(style === 'Realistic') b = 1200;
  let multiplier = 1; let c = document.getElementById('reqSubjects').value; if(c==='2') multiplier=1.5; if(c==='3') multiplier=2; if(c==='4') multiplier=2.5;
  const total = Math.round(b * multiplier); if(document.getElementById('pvPrice')) document.getElementById('pvPrice').textContent = '₹' + total; return total;
}
let uploadedPreviewImage = '';

function handleFileDrop(input) { 
  if (input.files.length > 0) { 
      document.getElementById('fileLabel').textContent = '✓ ' + input.files[0].name; 
      
      const reader = new FileReader();
      reader.onload = function(e) {
          uploadedPreviewImage = e.target.result;
          
          // Add 'Simulate AI Preview' section to sidebar if not present
          let aiPanel = document.getElementById('aiPreviewPanel');
          if(!aiPanel) {
              const sidebar = document.querySelector('#view-commission .sidebar-panel');
              const panelHtml = `
                  <div id="aiPreviewPanel" class="card mt-4 p-3" style="background:var(--bg-primary); border:2px dashed var(--accent);">
                      <h4 class="mb-2"><span class="text-accent">✨</span> AI Style Preview</h4>
                      <p class="text-sm text-muted mb-3">See how your photo might look in the chosen style.</p>
                      <button type="button" class="btn-secondary w-100" id="btnSimulateAI" onclick="simulateAIPreview()">Generate AI Proof</button>
                      <div id="aiResultArea" class="mt-3" style="display:none; text-align:center;">
                          <div style="position:relative; width:100%; border-radius:var(--radius); overflow:hidden;">
                              <img id="aiResultImg" src="" style="width:100%; filter:blur(2px); transition:filter 1.5s ease-in-out;" />
                              <div id="aiSpin" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);">
                                  <span style="font-size:2rem; animation: pulse 1s infinite;">⚙️</span>
                              </div>
                          </div>
                          <p class="text-xs text-muted mt-2">Simulated mockup based on your reference.</p>
                      </div>
                  </div>
              `;
              if(sidebar) sidebar.insertAdjacentHTML('beforeend', panelHtml);
          }

          // If it was already active, refresh it with the new uploaded image
          const img = document.getElementById('aiResultImg');
          if(img && document.getElementById('aiResultArea').style.display !== 'none') {
              simulateAIPreview(); 
          }
      };
      reader.readAsDataURL(input.files[0]);
  } 
}

function simulateAIPreview() {
    const resArea = document.getElementById('aiResultArea');
    const spin = document.getElementById('aiSpin');
    const img = document.getElementById('aiResultImg');
    const btn = document.getElementById('btnSimulateAI');
    const style = document.getElementById('reqStyle').value;
    
    if(!uploadedPreviewImage) {
        showToast('Please upload an image first!');
        return;
    }

    resArea.style.display = 'block';
    img.src = uploadedPreviewImage;
    img.style.filter = 'blur(15px) grayscale(100%)';
    spin.style.display = 'block';
    btn.textContent = 'Applying ' + style + ' filters...';
    btn.disabled = true;

    setTimeout(() => {
        spin.style.display = 'none';
        
        let appliedFilter = '';
        if(style === 'Digital') appliedFilter = 'saturate(1.5) contrast(1.15) brightness(1.05)';
        else if(style === 'Sketch') appliedFilter = 'grayscale(1) contrast(1.5) brightness(1.15) sepia(0.15)';
        else if(style === 'Cartoon') appliedFilter = 'saturate(2) contrast(1.2) brightness(1.1) hue-rotate(-10deg)';
        else if(style === 'Realistic') appliedFilter = 'sepia(0.25) saturate(1.1) contrast(1.05) brightness(0.95)';
        else appliedFilter = 'saturate(1.2) contrast(1.1)'; // default
        
        img.style.filter = appliedFilter;
        img.style.border = '2px solid var(--accent)';
        btn.textContent = 'Regenerate Preview';
        btn.disabled = false;
        showToast('AI Filter Applied!');
    }, 1500);
}

function goToCommissionConfirmation() {
  const subjEl = document.getElementById('reqSubjects'); document.getElementById('confCustSubj').textContent = subjEl.options[subjEl.selectedIndex].text;
  const style = document.getElementById('reqStyle').value; document.getElementById('confCustStyle').textContent = style;
  document.getElementById('confCustBg').textContent = document.getElementById('reqBg').value; document.getElementById('confCustNotes').textContent = document.getElementById('reqNotes').value || '—';
  document.getElementById('confCustThumb').textContent = style.charAt(0); document.getElementById('confCustPrice').textContent = '₹' + updatePreview();
  navigateTo('view-commission-confirmation');
}

// DASHBOARD
function renderOrdersList(filter = 'All') {
  const container = document.getElementById('ordersListContainer'); if(!container) return; container.innerHTML = '';
  let filtered = myOrders; if(filter !== 'All') filtered = myOrders.filter(o => filter==='Completed' ? o.status==='Completed': o.type===filter);
  if(currentUser && currentUser.role==='customer') filtered = filtered.filter(f => true); // Normally would filter by user email, skipping here to show everything
  if(filtered.length === 0) { container.innerHTML = '<p class="text-muted p-4 bg-alt text-center border-radius">No orders found.</p>'; return; }
  filtered.forEach(o => {
    let imgB = o.type === 'Direct' ? `<img src="${o.img}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;">` : `<div style="width:80px;height:80px;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:2rem;font-weight:bold;">${o.style?o.style.charAt(0):'C'}</div>`;
    container.innerHTML += `<div class="card p-3 card-hover border-l-accent flex flex-between align-center" onclick="openOrderDetails('${o.id}')"><div class="flex-gap align-center text-left">${imgB}<div><h4 class="mb-1">${o.id} <span class="badge ml-2" style="font-weight:normal; font-size:0.7rem;">${o.type}</span></h4><p class="text-sm m-0">${o.title} <strong class="text-accent ml-2">₹${o.price}</strong></p><p class="text-sm text-muted m-0">${o.date}</p></div></div><div class="text-right"><span class="badge badge-secondary mb-2">${o.status}</span><p class="text-sm text-accent font-bold mb-0">Track Order →</p></div></div>`;
  });
}
function filterOrders(filter, btnEl) { document.querySelectorAll('#dashBuyer .filter-tabs .btn-filter').forEach(btn => btn.classList.remove('active')); btnEl.classList.add('active'); renderOrdersList(filter); }

function openOrderDetails(id) {
  const o = myOrders.find(x => x.id === id); if(!o) return;
  currentActiveOrderId = id;
  document.getElementById('odID').textContent = 'Order ' + o.id; document.getElementById('odDate').textContent = 'Date: ' + o.date;
  document.getElementById('odStatusBadge').textContent = o.status; document.getElementById('odType').textContent = o.type + ' Order';
  
  const chatPanel = document.getElementById('orderChatPanel');
  if(o.type === 'Direct') {
    document.getElementById('odImg').src = o.img; document.getElementById('odImg').style.display = 'block'; document.getElementById('odTitle').textContent = o.title;
    document.getElementById('odArtist').textContent = 'By ' + o.artist; document.getElementById('odArtist').dataset.artist = o.artist; document.getElementById('odCustomDetails').style.display = 'none';
    if(chatPanel) chatPanel.style.display = 'none';
  } else {
    document.getElementById('odImg').style.display = 'none'; document.getElementById('odTitle').textContent = o.title;
    document.getElementById('odArtist').textContent = (o.artist === 'Assigned Later') ? 'Awaiting Artist' : ('By ' + o.artist);
    if(o.artist !== 'Assigned Later') document.getElementById('odArtist').dataset.artist = o.artist;
    document.getElementById('odCustomDetails').style.display = 'block'; document.getElementById('odCustomSubj').textContent = o.subjects;
    document.getElementById('odCustomBg').textContent = o.bg; document.getElementById('odCustomNotes').textContent = o.notes || 'No special notes.';
    
    // Show chat panel for custom orders
    if(chatPanel) {
       chatPanel.style.display = 'flex';
       renderOrderChat();
    }
  }
  document.getElementById('odProgressFill').style.display = 'none'; // Hide old progress bar, we use timeline now
  document.getElementById('odProgressFill').parentElement.style.display = 'none'; 
  
  const tl = document.getElementById('odTimeline');
  tl.style.display = 'flex';
  tl.style.flexDirection = 'column';
  tl.style.gap = '1rem';
  tl.style.margin = '1.5rem 0';
  
  let stages = [];
  if(o.type === 'Direct') {
      stages = [
          { name: 'Order Placed', desc: 'Payment received.', icon: '📦', active: true },
          { name: 'Shipped', desc: 'On its way.', icon: '🚚', active: o.progress >= 50 },
          { name: 'Completed', desc: 'Delivered.', icon: '✅', active: o.status === 'Completed' }
      ];
  } else {
      // Extensive custom workflow
      const milestones = [
          { p: 0, name: 'Request Submitted', desc: '30% Initial Paid.', icon: '✉️' },
          { p: 20, name: 'Artist Accepted', desc: 'Work has begun.', icon: '🤝' },
          { p: 40, name: 'Sketch Phase', desc: 'Awaiting your approval.', icon: '✏️' },
          { p: 60, name: 'Coloring Phase', desc: '40% Mid-stage Paid.', icon: '🎨' },
          { p: 80, name: 'Final Delivery', desc: '30% Final Payment Pending.', icon: '🖼️' },
          { p: 100, name: 'Completed', desc: 'Order closed.', icon: '✅' }
      ];
      stages = milestones.map(m => ({
          ...m,
          active: o.progress >= m.p || o.status === 'Completed',
          current: (o.progress === m.p && o.status !== 'Completed') || (o.progress > m.p && milestones.find(nx => nx.p > m.p && o.progress < nx.p))
      }));
  }
  
  tl.innerHTML = stages.map((s, idx) => `
      <div style="display:flex; align-items:flex-start; gap:1rem; opacity: ${s.active ? '1' : '0.4'}; transition: all 0.3s;">
          <div style="display:flex; flex-direction:column; align-items:center;">
              <div style="width:40px; height:40px; border-radius:50%; background:${s.active ? 'var(--accent)' : 'var(--bg-alt)'}; color:${s.active ? '#fff' : 'var(--text-muted)'}; display:flex; justify-content:center; align-items:center; font-size:1.2rem; border:2px solid ${s.current ? 'var(--secondary)' : 'transparent'}; box-shadow: ${s.current ? '0 0 15px var(--secondary)' : 'none'};">
                  ${s.icon}
              </div>
              ${idx < stages.length - 1 ? `<div style="width:3px; height:30px; background:${stages[idx+1].active ? 'var(--accent)' : 'var(--border)'}; margin-top:0.5rem;"></div>` : ''}
          </div>
          <div style="padding-top:0.25rem;">
              <strong style="font-size:1.1rem; color:${s.current ? 'var(--secondary)' : 'var(--text-primary)'}">${s.name}</strong>
              <p class="text-sm text-muted m-0">${s.desc}</p>
              ${s.current && s.name === 'Sketch Phase' ? `<button class="btn-primary mt-2" style="padding:0.25rem 0.75rem; font-size:0.8rem;" onclick="showToast('Sketch Approved!'); this.style.display='none';">Approve Sketch</button>` : ''}
              ${s.current && s.name === 'Coloring Phase' && currentUser.role === 'customer' ? `<button class="btn-secondary mt-2" style="padding:0.25rem 0.75rem; font-size:0.8rem;" onclick="showToast('Mid-stage Payment Processed.'); this.style.display='none';">Pay 40% Mid-Stage</button>` : ''}
              ${s.current && s.name === 'Final Delivery' && currentUser.role === 'customer' ? `<button class="btn-secondary mt-2" style="padding:0.25rem 0.75rem; font-size:0.8rem;" onclick="showToast('Final Payment Processed.'); this.style.display='none';">Pay 30% Final</button>` : ''}
          </div>
      </div>
  `).join('');

  const btnRev = document.getElementById('btnOdReview');
  if (o.status === 'Completed' && currentUser && currentUser.role === 'customer' && !o.reviewed) {
      btnRev.style.display = 'block';
      btnRev.onclick = () => openReviewModal(o.id, o.artist);
  } else {
      btnRev.style.display = 'none';
  }
  
  // Custom Disputed Logic (MOCK)
  const contentArea = tl.parentElement;
  let disputeBtn = document.getElementById('raiseDisputeBtn');
  if(!disputeBtn) {
      disputeBtn = document.createElement('button');
      disputeBtn.id = 'raiseDisputeBtn';
      disputeBtn.className = 'btn-secondary mt-3 w-100';
      disputeBtn.style.color = '#E74C3C';
      disputeBtn.style.borderColor = '#E74C3C';
      disputeBtn.style.background = 'transparent';
      disputeBtn.innerHTML = '🚩 Raise Issue / Dispute';
      disputeBtn.onclick = () => {
          showToast('Dispute Panel Opened (Mock)');
          disputeBtn.innerHTML = 'Dispute Submitted. Admin Reviewing.';
          disputeBtn.disabled = true;
          disputeBtn.style.opacity = '0.5';
      };
      contentArea.appendChild(disputeBtn);
  } else {
      disputeBtn.innerHTML = '🚩 Raise Issue / Dispute';
      disputeBtn.disabled = false;
      disputeBtn.style.opacity = '1';
      disputeBtn.style.display = (o.status === 'Completed') ? 'none' : 'block';
  }

  navigateTo('view-order-details');
}

function renderOrderChat() {
   const chatBody = document.getElementById('orderChatBody');
   if(!chatBody) return;
   chatBody.innerHTML = '';
   if(!orderChats[currentActiveOrderId]) {
       orderChats[currentActiveOrderId] = [
           { sender: 'System', text: 'Chat started. You can now communicate regarding this custom portrait.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
       ];
       saveOrderChats();
   }

   const messages = orderChats[currentActiveOrderId];
   messages.forEach(msg => {
       const isMine = msg.sender === currentUser?.name || (msg.senderRole === currentUser?.role);
       const align = isMine ? 'flex-end' : 'flex-start';
       const bg = isMine ? 'var(--accent)' : 'var(--bg-secondary)';
       const color = isMine ? '#000' : 'var(--text-primary)';
       
       const bubble = document.createElement('div');
       bubble.style.cssText = `align-self: ${align}; max-width: 80%;`;
       bubble.innerHTML = `
           <div style="background: ${bg}; color: ${color}; padding: 10px 15px; border-radius: 8px; margin-bottom: 5px;">
               ${msg.text}
           </div>
           <div style="font-size: 0.7rem; color: var(--text-muted); text-align: ${isMine ? 'right' : 'left'};">
               ${msg.sender === 'System' ? '' : msg.sender + ' • '} ${msg.time}
           </div>
       `;
       chatBody.appendChild(bubble);
   });
   chatBody.scrollTop = chatBody.scrollHeight;
}

function sendOrderMessage() {
   const input = document.getElementById('orderChatInput');
   const text = input.value.trim();
   if(!text || !currentActiveOrderId || !currentUser) return;
   
   orderChats[currentActiveOrderId].push({
       sender: currentUser.name,
       senderRole: currentUser.role,
       text: text,
       time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
   });
   saveOrderChats();
   input.value = '';
   renderOrderChat();
}

function downloadInvoice() { showToast('Downloading Invoice PDF...'); }

// VIEWS & MISC
let followedArtists = JSON.parse(localStorage.getItem('artifyFollows') || '[]');
function openArtistDetails(name) {
  const art = artistsData.find(a => a.name === name); if(!art) return; 
  document.getElementById('detailArtistImg').src = art.img; document.getElementById('detailArtistName').textContent = art.name;
  document.getElementById('detailArtistStyle').textContent = art.style;
  
  if(document.getElementById('detailArtistExp')) document.getElementById('detailArtistExp').textContent = art.yearsExperience + ' Years';
  if(document.getElementById('detailArtistTotalArt')) document.getElementById('detailArtistTotalArt').textContent = art.totalArtworks;
  if(document.getElementById('detailArtistRatingCount')) document.getElementById('detailArtistRatingCount').textContent = `(${art.rating} • ${art.revCount} Reviews)`;

  const btn = document.getElementById('btnFollowArtist');
  if(followedArtists.includes(art.name)) { btn.textContent = '✓ Following'; btn.classList.add('active', 'btn-primary'); btn.classList.remove('btn-outline'); }
  else { btn.textContent = '+ Follow'; btn.classList.remove('active', 'btn-primary'); btn.classList.add('btn-outline'); }
  
  const p = document.getElementById('detailArtistPortfolio'); p.innerHTML = '';
  galleryData.filter(g => g.artist === name).forEach(item => { 
     p.innerHTML += `<div class="card gallery-card p-0 hover-scale-slight border-l-accent" onclick="openArtworkDetails(${item.id})"><img src="${item.img}" class="gallery-img"><div class="gallery-hover-actions"><button class="btn-primary" onclick="event.stopPropagation(); openArtworkDetails(${item.id})">View Details</button><button class="btn-secondary" onclick="event.stopPropagation(); processDirectOrderCheckoutQuick(${item.id})">Buy Now</button></div><div class="p-3 bg-alt flex-between align-start"><h4 class="m-0">${item.title}</h4><div class="text-right"><span class="text-accent font-bold block">₹${item.price}</span><span class="text-xs text-secondary font-bold">★ ${item.rating}</span></div></div></div>`; 
  });
  
  document.getElementById('detailArtistBio').textContent = art.desc; 
  renderArtistReviews('all', name);
  renderSimilarArtists(name);
  switchArtistTab('portfolio'); navigateTo('view-artist-details');
}
function switchArtistTab(tab) { document.querySelectorAll('#view-artist-details .btn-filter').forEach(b => { b.classList.remove('active'); b.style.borderBottom = 'none'; }); const act = document.getElementById(`atab-${tab}`); if(act) { act.classList.add('active'); act.style.borderBottom = '3px solid var(--accent)'; } document.querySelectorAll('.artist-tab-pane').forEach(p => p.style.display = 'none'); document.getElementById(`artistTab-${tab}`).style.display = 'block'; }
function toggleFollowArtist() { const n = document.getElementById('detailArtistName').textContent; if(followedArtists.includes(n)) { followedArtists = followedArtists.filter(a => a !== n); showToast('Unfollowed ' + n); } else { followedArtists.push(n); showToast('Followed ' + n + ' 🔔'); } localStorage.setItem('artifyFollows', JSON.stringify(followedArtists)); openArtistDetails(n); }
function commissionFromArtist() { const sEl = document.getElementById('detailArtistStyle'); if(sEl) document.getElementById('reqStyle').value = sEl.textContent.includes('Digital')?'Digital':(sEl.textContent.includes('Sketch')?'Sketch':'Realistic'); document.getElementById('reqNotes').value = `Commissioning ${document.getElementById('detailArtistName').textContent}:\n`; updatePreview(); navigateTo('view-commission'); }

let currentlyViewedArtistForReviews = null;
function renderArtistReviews(filter, name) {
   if(name) currentlyViewedArtistForReviews = name;
   const artistName = name || currentlyViewedArtistForReviews;
   const art = artistsData.find(a => a.name === artistName); if(!art) return;
   
   const cont = document.getElementById('artistReviewsContainer'); if(!cont) return; cont.innerHTML = '';
   let revs = art.reviews || [];
   if(filter !== 'all') revs = revs.filter(r => r.rating === parseInt(filter));
   
   if(revs.length === 0) { cont.innerHTML = '<p class="text-muted text-center p-4 bg-alt border-radius">No reviews found for this filter.</p>'; return; }
   revs.forEach(r => {
      let stars = '★'.repeat(r.rating) + '☆'.repeat(5-r.rating);
      cont.innerHTML += `<div class="review-card mb-3"><img src="https://ui-avatars.com/api/?name=${encodeURIComponent(r.user)}&background=random&color=fff" class="avatar-small"><div><div class="stars text-secondary mb-1">${stars}</div><h4 class="m-0">${r.user} <span class="text-muted text-sm font-normal ml-2">${r.date}</span></h4><p class="text-muted mt-2 mb-0">"${r.comment}"</p></div></div>`;
   });
}
function filterReviews(filter, btn) {
   document.querySelectorAll('#artistTab-reviews .filter-tabs .btn-filter').forEach(b => b.classList.remove('active'));
   if(btn) btn.classList.add('active');
   renderArtistReviews(filter, null);
}

function renderSimilarArtists(currentName) {
   const container = document.getElementById('similarArtistsContainer'); if(!container) return; container.innerHTML = '';
   const others = artistsData.filter(a => a.name !== currentName);
   others.forEach(art => {
      container.innerHTML += `<div class="horizontal-artist-card card-hover" onclick="openArtistDetails('${art.name}')"><div style="height:100px; background:linear-gradient(135deg, var(--secondary), var(--accent));"></div><div class="p-4" style="margin-top:-50px;"><img src="${art.img}" class="avatar-mid box-shadow-xl" style="background:var(--bg-secondary); border:3px solid var(--bg-secondary);"><h4 class="mt-2 mb-1">${art.name}</h4><p class="text-sm text-secondary font-bold m-0">${art.style}</p><div class="stars text-xs text-muted mt-2 font-bold" style="color:var(--text-secondary)">★ ${art.rating} <span style="color:var(--text-muted); font-weight:normal;">(${art.revCount})</span></div></div></div>`;
   });
}

let chatOpen = false;
function openSimulatedChat() { document.getElementById('chatWidget').style.display='flex'; document.getElementById('chatWidget').classList.remove('collapsed'); chatOpen=true; }
function toggleChatBody() { const w = document.getElementById('chatWidget'); if(chatOpen) { w.classList.add('collapsed'); setTimeout(()=>w.style.display='none',300); chatOpen=false;} }
function sendChat() { const c = document.getElementById('chatInput'); const t = c.value.trim(); if(!t) return; const b = document.getElementById('chatBody'); b.innerHTML += `<div class="chat-bubble user">${t}</div>`; c.value=''; b.scrollTop=b.scrollHeight; setTimeout(()=>{b.innerHTML+=`<div class="chat-bubble artist">Understood!</div>`; b.scrollTop=b.scrollHeight;},1000);}

function toggleWishlist(id, evt) { if(evt) evt.stopPropagation(); let wl = JSON.parse(localStorage.getItem('artifyWishlist') || '[]'); if(wl.includes(id)) { wl = wl.filter(x => x!==id); showToast('Removed from Wishlist'); } else { wl.push(id); showToast('Added to Wishlist'); } localStorage.setItem('artifyWishlist', JSON.stringify(wl)); renderWishlist(); }
function renderWishlist() { let wl = JSON.parse(localStorage.getItem('artifyWishlist') || '[]'); const c = document.getElementById('wishlistContainer'); const e = document.getElementById('emptyWishlist'); if(!c) return; c.innerHTML = ''; if(document.getElementById('wishCount')) document.getElementById('wishCount').textContent = wl.length; if(wl.length===0){c.style.display='none'; e.style.display='block'; return;} c.style.display='grid'; e.style.display='none'; wl.forEach(id => { const item = galleryData.find(g => g.id === id); if(item) c.innerHTML += `<div class="card gallery-card p-0" onclick="openArtworkDetails(${item.id})"><img src="${item.img}" class="gallery-img"><div class="p-3 flex-between"><h4 class="text-sm truncate m-0">${item.title}</h4><button class="icon-btn text-danger" onclick="event.stopPropagation(); toggleWishlist(${id}, event)">✕</button></div></div>`; }); }
function updateBeforeAfter() { const s = document.getElementById('baSlider'), w = document.getElementById('baWrapper'); if(s&&w) w.style.width = s.value + "%"; }
function openZoom(src, c) { document.getElementById('zoomImage').src = src; document.getElementById('zoomModal').classList.add('flex'); }
function closeZoom() { document.getElementById('zoomModal').classList.remove('flex'); }

// ==========================================
// CUSTOMER HUB & COMMUNITY SYSTEM
// ==========================================
const communityData = [
  { id: 101, artist: 'Elena R.', user: 'Michael T.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', text: 'Absolutely love my new portrait. Elena captured the expression perfectly!', likes: 24, comments: 3, time: '2 hours ago' },
  { id: 102, artist: 'Marcus Chen', user: 'Sarah L.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', text: 'The sketch style is so raw and beautiful. Highly recommend Marcus!', likes: 18, comments: 1, time: '5 hours ago' },
  { id: 103, artist: 'Sarah Jenkins', user: 'David W.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', text: 'My family was thrilled with this custom realistic oil painting. Thank you!', likes: 56, comments: 8, time: '1 day ago' }
];

let artifyLikes = JSON.parse(localStorage.getItem('artifyLikes') || '[]');

function switchCustomerTab(tab) {
   document.querySelectorAll('#view-customer-hub .btn-filter').forEach(b => { b.classList.remove('active'); b.style.borderBottom = 'none'; });
   const act = document.getElementById(`ctab-${tab}`);
   if(act) { act.classList.add('active'); act.style.borderBottom = '3px solid var(--accent)'; }
   document.querySelectorAll('.customer-tab-pane').forEach(p => p.style.display = 'none');
   document.getElementById(`customerTab-${tab}`).style.display = 'block';
}

function renderGalleryHub(filter = 'all', btn = null) {
   if(btn) { document.querySelectorAll('#customerTab-artworks .filter-bar .btn-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }
   const container = document.getElementById('hubGalleryContainer'); if(!container) return; container.innerHTML = '';
   let g = galleryData; if(filter !== 'all') g = galleryData.filter(x => x.style === filter);
   if(g.length === 0) { container.innerHTML = '<p class="text-muted col-span-3 text-center">No artworks found.</p>'; return; }
   g.forEach(item => {
      container.innerHTML += `<div class="card gallery-card p-0 hover-scale-slight border-l-accent" onclick="openArtworkDetails(${item.id})"><img src="${item.img}" class="gallery-img"><div class="gallery-hover-actions"><button class="btn-primary" onclick="event.stopPropagation(); openArtworkDetails(${item.id})">View Details</button><button class="btn-secondary" onclick="event.stopPropagation(); processDirectOrderCheckoutQuick(${item.id})">Buy Now</button></div><div class="p-3 bg-alt flex-between align-start"><h4 class="m-0">${item.title}</h4><div class="text-right"><span class="text-accent font-bold block">₹${item.price}</span><span class="text-xs text-secondary font-bold">★ ${item.rating}</span></div></div></div>`;
   });
}
function searchGalleryHub(query) {
   const container = document.getElementById('hubGalleryContainer'); if(!container) return; container.innerHTML = '';
   const g = galleryData.filter(x => x.title.toLowerCase().includes(query.toLowerCase()) || x.artist.toLowerCase().includes(query.toLowerCase()));
   if(g.length === 0) { container.innerHTML = '<p class="text-muted col-span-3 text-center">No matches found.</p>'; return; }
   g.forEach(item => { container.innerHTML += `<div class="card gallery-card p-0 hover-scale-slight border-l-accent" onclick="openArtworkDetails(${item.id})"><img src="${item.img}" class="gallery-img"><div class="gallery-hover-actions"><button class="btn-primary" onclick="event.stopPropagation(); openArtworkDetails(${item.id})">View Details</button><button class="btn-secondary" onclick="event.stopPropagation(); processDirectOrderCheckoutQuick(${item.id})">Buy Now</button></div><div class="p-3 bg-alt flex-between align-start"><h4 class="m-0">${item.title}</h4><div class="text-right"><span class="text-accent font-bold block">₹${item.price}</span><span class="text-xs text-secondary font-bold">★ ${item.rating}</span></div></div></div>`; });
}

function renderDiscoveryArtists() {
   const tCont = document.getElementById('hubTrendingArtists');
   const rCont = document.getElementById('hubRecommendedArtists');
   if(!tCont || !rCont) return;
   tCont.innerHTML = ''; rCont.innerHTML = '';
   
   const trending = [...artistsData].sort((a,b) => b.rating - a.rating).slice(0, 4);
   trending.forEach(art => {
      tCont.innerHTML += `<div class="horizontal-artist-card card-hover" onclick="openArtistDetails('${art.name}')"><div style="height:100px; background:linear-gradient(135deg, var(--secondary), var(--accent));"></div><div class="p-4" style="margin-top:-50px;"><img src="${art.img}" class="avatar-mid box-shadow-xl" style="background:var(--bg-secondary); border:3px solid var(--bg-secondary);"><h4 class="mt-2 mb-1">${art.name}</h4><p class="text-sm text-secondary font-bold m-0">${art.style}</p><div class="stars text-xs mt-2 font-bold" style="color:#f59e0b;">★ ${art.rating} <span style="color:var(--text-muted); font-weight:normal;">(${art.revCount} reviews)</span></div></div></div>`;
   });
   
   let wlStyles = ['Digital'];
   const savedWl = JSON.parse(localStorage.getItem('artifyWishlist') || '[]');
   if(savedWl.length > 0) { const firstWl = galleryData.find(g => g.id === savedWl[0]); if(firstWl) wlStyles.push(firstWl.style); }
   const rec = artistsData.filter(a => wlStyles.includes(a.style) || a.rating >= 4.7).slice(0, 3);
   rec.forEach(art => {
      rCont.innerHTML += `<div class="card p-4 flex align-center flex-gap card-hover border-l-accent border-radius cursor-pointer" onclick="openArtistDetails('${art.name}')"><img src="${art.img}" class="avatar-mid"><div style="flex:1;"><h4 class="m-0 mb-1">${art.name}</h4><p class="text-sm text-muted m-0">${art.style}</p></div><div class="text-right"><span class="text-sm font-bold" style="color:#f59e0b;">★ ${art.rating}</span><p class="text-xs text-muted m-0 mt-1">${art.totalArtworks} pieces</p></div></div>`;
   });
}

function renderCommunityFeed() {
   const cont = document.getElementById('hubCommunityFeed'); if(!cont) return; cont.innerHTML = '';
   communityData.forEach(post => {
      const isLiked = artifyLikes.includes(post.id);
      cont.innerHTML += `
      <div class="social-post-card">
         <div class="p-3 flex-between align-center border-bottom">
            <div class="flex-gap align-center"><img src="https://ui-avatars.com/api/?name=${encodeURIComponent(post.user)}&background=random&color=fff" class="avatar-small"><div><h4 class="m-0">${post.user}</h4><p class="text-xs text-muted m-0">Ordered from <span class="artist-link font-bold" onclick="openArtistDetails('${post.artist}')">${post.artist}</span></p></div></div>
            <span class="text-xs text-muted">${post.time}</span>
         </div>
         <img src="${post.img}" alt="Community Art">
         <div class="p-4">
            <div class="flex-gap mb-3">
               <button class="social-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikePost(${post.id}, this)">${isLiked ? '❤️' : '🤍'} <span class="like-count">${post.likes + (isLiked?1:0)}</span></button>
               <button class="social-action-btn" onclick="showToast('Comments opening soon')">💬 ${post.comments}</button>
               <button class="social-action-btn ml-auto" onclick="showToast('Link Copied!')">🔗 Share</button>
            </div>
            <p class="text-sm m-0"><strong>${post.user}</strong> ${post.text}</p>
         </div>
      </div>`;
   });
}

function toggleLikePost(id, btnEl) {
   let count = communityData.find(x => x.id === id).likes;

   if(artifyLikes.includes(id)) {
      artifyLikes = artifyLikes.filter(x => x !== id);
      btnEl.classList.remove('liked');
      btnEl.innerHTML = `🤍 <span class="like-count">${count}</span>`;
   } else {
      artifyLikes.push(id);
      btnEl.classList.add('liked');
      btnEl.innerHTML = `❤️ <span class="like-count">${count + 1}</span>`;
      showToast('You liked this post!');
   }
   localStorage.setItem('artifyLikes', JSON.stringify(artifyLikes));
}


// ==========================================
// REDDIT-STYLE FORUM LOGIC
// ==========================================
let forumVotes = JSON.parse(localStorage.getItem('artifyForumVotes') || '{}');
function saveForumVotes() { localStorage.setItem('artifyForumVotes', JSON.stringify(forumVotes)); }

function renderForum(filter = 'hot', btn = null) {
    if(btn) {
       document.querySelectorAll('#view-forum .filter-bar .btn-filter').forEach(b => b.classList.remove('active'));
       btn.classList.add('active');
    }
    const container = document.getElementById('forumContainer');
    if(!container) return;
    container.innerHTML = '';
    
    let posts = [...forumData];
    if(filter === 'hot') posts.sort((a,b) => b.upvotes - a.upvotes);
    if(filter === 'new') posts.sort((a,b) => b.id - a.id);
    if(filter === 'critique') posts = posts.filter(p => p.type === 'critique');
    
    if(posts.length === 0) { container.innerHTML = '<p class="text-muted text-center py-5">No posts found in this category.</p>'; return; }
    
    posts.forEach(post => {
        const userVote = forumVotes[post.id];
        const upClass = userVote === 'up' ? 'text-accent' : '';
        const downClass = userVote === 'down' ? 'text-danger' : '';
        
        container.innerHTML += `
        <div class="card p-0 flex" style="background:var(--bg-secondary); border-radius: 8px; overflow:hidden;">
            <div class="flex-column align-center p-3" style="background:var(--bg-alt); width: 60px;">
                <button class="icon-btn text-lg ${upClass}" onclick="upvotePost(${post.id})">⬆</button>
                <strong class="my-2">${post.upvotes}</strong>
                <button class="icon-btn text-lg ${downClass}" onclick="downvotePost(${post.id})">⬇</button>
            </div>
            <div class="p-4 flex-1">
                <div class="text-xs text-muted mb-2">Posted by <strong class="text-accent">${post.user}</strong> • ${post.time}</div>
                <h3 class="mb-2 font-display text-xl m-0">${post.title}</h3>
                <p class="text-muted mb-3" style="line-height:1.6;">${post.content}</p>
                ${post.img ? `<img src="${post.img}" class="full-radius-img hover-scale-slight cursor-pointer mb-3" onclick="openZoom('${post.img}')" style="max-height:300px; width:auto; max-width:100%; border:2px solid var(--border);">` : ''}
                <div class="flex-gap text-sm text-muted font-bold mt-2">
                    <span class="cursor-pointer hover-text-accent" onclick="showToast('Comments opening soon')">💬 ${post.comments} Comments</span>
                    <span class="cursor-pointer hover-text-accent" onclick="showToast('Post Link Copied!')">🔗 Share</span>
                </div>
            </div>
        </div>`;
    });
}

function upvotePost(id) {
    const post = forumData.find(p => p.id === id);
    if(!post) return;
    if(forumVotes[id] === 'up') { post.upvotes--; delete forumVotes[id]; }
    else { if(forumVotes[id] === 'down') post.upvotes++; post.upvotes++; forumVotes[id] = 'up'; }
    lsWrite(LS_KEYS.forum, forumData);
    saveForumVotes();
    const activeBtn = document.querySelector('#view-forum .filter-bar .active');
    if(activeBtn) renderForum(activeBtn.id.replace('forumBtn-', ''), activeBtn);
    else renderForum();
}

function downvotePost(id) {
    const post = forumData.find(p => p.id === id);
    if(!post) return;
    if(forumVotes[id] === 'down') { post.upvotes++; delete forumVotes[id]; }
    else { if(forumVotes[id] === 'up') post.upvotes--; post.upvotes--; forumVotes[id] = 'down'; }
    lsWrite(LS_KEYS.forum, forumData);
    saveForumVotes();
    const activeBtn = document.querySelector('#view-forum .filter-bar .active');
    if(activeBtn) renderForum(activeBtn.id.replace('forumBtn-', ''), activeBtn);
    else renderForum();
}

function openForumModal() {
    if(!currentUser) return showToast('Please sign in to post!');
    document.getElementById('forumPostModal').classList.add('flex');
}

function submitForumPost() {
    const title = document.getElementById('forumPostTitle').value.trim();
    const content = document.getElementById('forumPostContent').value.trim();
    const img = document.getElementById('forumPostImg').value.trim();
    
    if(!title || !content) return showToast('Title and content are required.');

    const newPost = { id: Date.now(), title, user: currentUser.name, time: 'Just now', content, img: img || '', upvotes: 1, comments: 0, type: 'new' };
    forumData.unshift(newPost);
    lsWrite(LS_KEYS.forum, forumData);

    document.getElementById('forumPostTitle').value = '';
    document.getElementById('forumPostContent').value = '';
    document.getElementById('forumPostImg').value = '';
    document.getElementById('forumPostModal').classList.remove('flex');
    showToast('Post published!');
    renderForum('new', document.getElementById('forumBtn-new'));
}

function goHome() {
   if(currentUser && currentUser.role === 'artist') navigateTo('view-artist-home');
   else if(currentUser && currentUser.role === 'customer') {
      renderGalleryHub('all'); renderDiscoveryArtists(); renderCommunityFeed();
      navigateTo('view-customer-hub');
   }
   else navigateTo('view-home');
}

// ==========================================
// REVIEW ENGINE
// ==========================================
let currentReviewOrder = null;
let currentReviewArtist = null;

function openReviewModal(orderId, artistName) {
   currentReviewOrder = orderId;
   currentReviewArtist = artistName;
   document.getElementById('revModalArtist').textContent = artistName;
   document.getElementById('revModalComment').value = '';
   if(document.getElementById('star5')) document.getElementById('star5').checked = true; // reset to 5 stars
   document.getElementById('reviewModal').classList.add('flex');
}

function submitReview() {
   const comment = document.getElementById('revModalComment').value.trim();
   let rating = 5;
   document.querySelectorAll('input[name="rating"]').forEach(r => { if(r.checked) rating = parseInt(r.value); });
   
   if (!comment) { showToast('Please write a short comment explaining your rating.'); return; }
   
   // Mark order as reviewed
   const order = myOrders.find(o => o.id === currentReviewOrder);
   if (order) {
       order.reviewed = true;
       const orders = lsRead(LS_KEYS.orders) || [];
       const stored = orders.find(x => x.id === order.id);
       if(stored) stored.reviewed = true;
       lsWrite(LS_KEYS.orders, orders);
   }
   
   // Apply review to artist
   let updatedArtistName = currentReviewArtist;
   if(updatedArtistName.startsWith('By ')) updatedArtistName = updatedArtistName.substring(3);
   
   const artist = artistsData.find(a => a.name === updatedArtistName);
   if (artist) {
      if (!artist.reviews) artist.reviews = [];
      artist.reviews.unshift({ user: currentUser.name, rating: rating, comment: comment, date: 'Just now' });
      
      const totalStars = artist.reviews.reduce((acc, r) => acc + r.rating, 0);
      artist.rating = (totalStars / artist.reviews.length).toFixed(1);
      artist.revCount = artist.reviews.length;
   }
   
   document.getElementById('reviewModal').classList.remove('flex');
   showToast('Review submitted successfully!');
   
   // Refresh order list and reopen order if from order page
   if (order) openOrderDetails(order.id);
   
   // If from artist or artwork page, refresh those views
   if (document.getElementById('view-artist-details').classList.contains('active') && updatedArtistName) {
       renderArtistReviews('all', updatedArtistName);
       // Refresh stars
       const art = artistsData.find(a => a.name === updatedArtistName);
       if(art && document.getElementById('detailArtistRatingCount')) {
           document.getElementById('detailArtistRatingCount').textContent = `(${art.rating} • ${art.revCount} Reviews)`;
       }
   } else if (document.getElementById('view-artwork-details').classList.contains('active')) {
       renderArtworkReviews();
   }
}

// ==========================================
// COMMISSION TEMPLATES (NEW)
// ==========================================
function renderCommissionTemplates() {
  const reqSubjects = document.getElementById('reqSubjects');
  if(!reqSubjects) return;
  const formPanel = reqSubjects.closest('.form-panel');
  if(document.getElementById('commTemplates')) return;
  
  const tempHtml = `
      <div id="commTemplates" class="mb-4 p-3" style="background:var(--bg-alt); border-radius:var(--radius); border: 1px dashed var(--accent);">
          <label class="text-sm text-secondary uppercase-track mb-2 font-bold block" style="font-size:0.8rem; letter-spacing:1px;"><span style="color:var(--accent);">✨</span> Commission Presets</label>
          <div class="flex gap-2 flex-wrap mb-2">
              <button class="btn-filter" style="border-radius:12px; padding:0.4rem 1rem; border-color:var(--accent); font-size:0.8rem;" type="button" onclick="applyTemplate('Couple Portrait', '2', 'Digital', 'Vibrant Gradient', 'A beautiful romantic couple portrait, glowing atmosphere.')">💑 Couple</button>
              <button class="btn-filter" style="border-radius:12px; padding:0.4rem 1rem; border-color:var(--accent); font-size:0.8rem;" type="button" onclick="applyTemplate('Pet Portrait', '1', 'Realistic', 'Plain White', 'A deeply detailed realistic painting of my lovely pet.')">🐶 Pet</button>
              <button class="btn-filter" style="border-radius:12px; padding:0.4rem 1rem; border-color:var(--accent); font-size:0.8rem;" type="button" onclick="applyTemplate('Anime Style', '1', 'Cartoon', 'Detailed Scene', 'Anime/Manga style illustration in an action pose.')">✨ Anime</button>
              <button class="btn-filter" style="border-radius:12px; padding:0.4rem 1rem; border-color:var(--accent); font-size:0.8rem;" type="button" onclick="applyTemplate('Family Heirloom', '4', 'Realistic', 'Dark Aesthetic', 'A classic vintage-style gathering of the family.')">👪 Family</button>
          </div>
          <p class="text-xs text-muted m-0"><em>Select a preset to auto-fill the form guidelines below.</em></p>
      </div>
  `;
  const pTag = formPanel.querySelector('p.text-muted');
  if(pTag) pTag.insertAdjacentHTML('afterend', tempHtml);
}

function applyTemplate(name, subjs, style, bg, notes) {
    document.getElementById('reqSubjects').value = subjs;
    if(document.getElementById('reqStyle').querySelector(`option[value="${style}"]`)) {
        document.getElementById('reqStyle').value = style;
    }
    if(document.getElementById('reqBg').querySelector(`option[value="${bg}"]`)) {
        document.getElementById('reqBg').value = bg;
    }
    document.getElementById('reqNotes').value = notes;
    updatePreview();
    showToast(`${name} template applied!`);
}

document.addEventListener('DOMContentLoaded', () => {
  const su = localStorage.getItem('artifyUser'); if(su) currentUser = JSON.parse(su);
  loadAppDataFromLocalStorage();

  updateAuthUI(); renderGallery(); renderAddresses(); updatePreview(); renderWishlist(); updateBeforeAfter();
  renderCommissionTemplates();
  if (currentUser && currentUser.role === 'customer') {
     renderGalleryHub('all'); renderDiscoveryArtists(); renderCommunityFeed();
     navigateTo('view-customer-hub');
  }
  const st = localStorage.getItem('artifyTheme'); if(st && st === 'dark') toggleTheme();
  
  // Real-time chat sync across tabs
  window.addEventListener('storage', (e) => {
      if(e.key === 'artifyChats' && document.getElementById('view-order-details').classList.contains('active')) {
          orderChats = JSON.parse(e.newValue || '{}');
          renderOrderChat();
      }
  });
});
