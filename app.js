/* ===================================================
   JAVASCRIPT — Generator Peta Jarak Dapur SPPG
   =================================================== */

// ── Default school data (from the example image) ──────────────────
let schools = [
  // TK (kiri)
  { nama: "TK Pertiwi Campaka", alamat: "Campaka", jumlah: 58, jarak: "800 M", waktu: 10, tipe: "tk", lat: -6.998188838352747, lng: 107.14259532316915, posisi: "kiri" },
  { nama: "TK Dahlia", alamat: "Campaka", jumlah: 93, jarak: "700 M", waktu: 10, tipe: "tk", lat: -6.997604436389063, lng: 107.14343774357762, posisi: "kiri" },
  { nama: "TK Al-Quran Daarul Fathan", alamat: "Campaka", jumlah: 54, jarak: "300 M", waktu: 5, tipe: "tk", lat: -6.99910365260981, lng: 107.14220334962948, posisi: "kiri" },
  { nama: "TK Nurussalam", alamat: "Campaka", jumlah: 37, jarak: "4,6 KM", waktu: 25, tipe: "tk", lat: -7.002506117225037, lng: 107.16167016606659, posisi: "kiri" },
  
  // POSYANDU (kiri)
  { nama: "Posyandu Dahlia 1", alamat: "Campaka", jumlah: 57, jarak: "1,5 KM", waktu: 20, tipe: "posyandu", lat: -6.993048821358376, lng: 107.1485268701083, posisi: "kiri" },
  { nama: "Posyandu Dahlia 2", alamat: "Campaka", jumlah: 54, jarak: "1,7 KM", waktu: 20, tipe: "posyandu", lat: -6.992183234881271, lng: 107.14884838247315, posisi: "kiri" },
  { nama: "Posyandu Tanjung", alamat: "Campaka", jumlah: 33, jarak: "2,5 KM", waktu: 25, tipe: "posyandu", lat: -6.99490924220997, lng: 107.15053940212593, posisi: "kiri" },
  
  // SD, SMP, SMK, POSYANDU (kanan)
  { nama: "SDN Campaka 3", alamat: "Campaka", jumlah: 404, jarak: "400 M", waktu: 7, tipe: "sd", lat: -6.998532942991176, lng: 107.14104203849526, posisi: "kanan" },
  { nama: "SMPN 1 Campaka", alamat: "Campaka", jumlah: 818, jarak: "500 M", waktu: 10, tipe: "smp", lat: -6.997507588382655, lng: 107.14232043742905, posisi: "kanan" },
  { nama: "SMKN 1 Campaka", alamat: "Campaka", jumlah: 1068, jarak: "500 M", waktu: 5, tipe: "smk", lat: -6.997641446732054, lng: 107.13929373962823, posisi: "kanan" },
  { nama: "Posyandu Mawar", alamat: "Campaka", jumlah: 184, jarak: "1,5 KM", waktu: 20, tipe: "posyandu", lat: -6.997445569051685, lng: 107.15384898407693, posisi: "kanan" },
  { nama: "Posyandu Anggrek", alamat: "Campaka", jumlah: 63, jarak: "", waktu: "", tipe: "posyandu", lat: "", lng: "", posisi: "kanan" },
  { nama: "Posyandu Melati", alamat: "Campaka", jumlah: 84, jarak: "2,7 KM", waktu: 27, tipe: "posyandu", lat: -7.002898188855134, lng: 107.16181300151237, posisi: "kanan" }
];

const PALETTE = [
  '#FF3B30', '#00FA9A', '#FFCC00', '#007AFF', '#FF2D55', 
  '#5AC8FA', '#8A2BE2', '#FF9500', '#4CD964', '#D70040', 
  '#00C78C', '#FF1493', '#5856D6', '#1abc9c', '#f1c40f'
];

schools.forEach((s, idx) => {
  s.color = PALETTE[idx % PALETTE.length];
});

let leafletMap = null;
let mapInitialized = false;

// ── Render editor school list ──────────────────────────────────────
function renderSchoolList() {
  const container = document.getElementById('schoolList');
  container.innerHTML = '';
  schools.forEach((s, i) => {
    container.innerHTML += `
      <div class="school-item" id="school_${i}">
        <div class="school-item-header">
          <span class="school-badge">SEKOLAH ${i + 1}</span>
          <button class="btn-remove" onclick="removeSchool(${i})">✕ Hapus</button>
        </div>
        <div class="school-form-row">
          <div class="form-group">
            <label>Nama Sekolah</label>
            <input type="text" value="${s.nama}" oninput="schools[${i}].nama=this.value" />
          </div>
          <div class="form-group">
            <label>Jumlah Siswa</label>
            <input type="number" value="${s.jumlah}" oninput="schools[${i}].jumlah=parseInt(this.value)||0" />
          </div>
          <div class="form-group">
            <label>Jarak (km)</label>
            <input type="text" value="${s.jarak}" oninput="schools[${i}].jarak=this.value" placeholder="1,5 KM" />
          </div>
          <div class="form-group">
            <label>Waktu (menit)</label>
            <input type="number" value="${s.waktu}" oninput="schools[${i}].waktu=this.value" />
          </div>
          <div class="form-group">
            <label>Tipe Instansi</label>
            <select onchange="schools[${i}].tipe=this.value">
              <option value="tk" ${s.tipe==='tk'?'selected':''}>TK</option>
              <option value="sd" ${s.tipe==='sd'?'selected':''}>SD / MI</option>
              <option value="smp" ${s.tipe==='smp'?'selected':''}>SMP / MTs</option>
              <option value="smk" ${s.tipe==='smk'?'selected':''}>SMK / SMA</option>
              <option value="posyandu" ${s.tipe==='posyandu'?'selected':''}>Posyandu</option>
            </select>
          </div>
        </div>
        <div class="school-form-row2" style="margin-top:10px;">
          <div class="form-group" style="grid-column:span 3">
            <label>Alamat</label>
            <input type="text" value="${s.alamat}" oninput="schools[${i}].alamat=this.value" />
          </div>
          <div class="form-group" style="grid-column:span 2">
            <label>Koordinat (Lat, Lng)</label>
            <input type="text" value="${(s.lat !== '' && s.lng !== '') ? (s.lat + ', ' + s.lng) : ''}" oninput="updateSchoolCoords(${i}, this.value)" placeholder="Contoh: -6.9930, 107.1480" />
          </div>
          <div class="form-group">
            <label>Posisi Label Peta</label>
            <select onchange="schools[${i}].posisi=this.value">
              <option value="kiri" ${s.posisi==='kiri'?'selected':''}>Kiri</option>
              <option value="kanan" ${s.posisi==='kanan'?'selected':''}>Kanan</option>
            </select>
          </div>
        </div>
      </div>`;
  });
}

function addSchool() {
  schools.push({ nama: "", alamat: "", jumlah: 0, jarak: "", waktu: "", tipe: "sd", lat: -6.54, lng: 107.12, posisi: "kiri" });
  renderSchoolList();
}

function removeSchool(i) {
  schools.splice(i, 1);
  renderSchoolList();
}

function updateSchoolCoords(i, value) {
  const parts = value.split(',');
  if (parts.length >= 2) {
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());
    schools[i].lat = isNaN(lat) ? "" : lat;
    schools[i].lng = isNaN(lng) ? "" : lng;
  } else {
    schools[i].lat = "";
    schools[i].lng = "";
  }
}

// ── Parse dapur coordinates from input ────────────────────────────
function getDapurCoords() {
  const raw = document.getElementById('dapur_coords').value;
  const parts = raw.split(',').map(p => parseFloat(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return { lat: parts[0], lng: parts[1] };
  return { lat: -7.001755031949489, lng: 107.14211077550756 };
}

// ── Stats calculation ──────────────────────────────────────────────
function calcStats() {
  const totalSiswa = schools.reduce((a, s) => a + (s.jumlah || 0), 0);
  const tkSiswa = schools.filter(s => s.tipe === 'tk').reduce((a, s) => a + (s.jumlah || 0), 0);
  const sdSiswa = schools.filter(s => s.tipe === 'sd').reduce((a, s) => a + (s.jumlah || 0), 0);
  const smpSiswa = schools.filter(s => s.tipe === 'smp').reduce((a, s) => a + (s.jumlah || 0), 0);
  const smkSiswa = schools.filter(s => s.tipe === 'smk').reduce((a, s) => a + (s.jumlah || 0), 0);
  const posSiswa = schools.filter(s => s.tipe === 'posyandu').reduce((a, s) => a + (s.jumlah || 0), 0);

  const parseJarak = j => parseFloat(j.toString().replace(',', '.')) || 0;
  const jarakArr = schools.map(s => parseJarak(s.jarak)).filter(v => v > 0);
  const minJarak = jarakArr.length ? Math.min(...jarakArr) : 0;
  const maxJarak = jarakArr.length ? Math.max(...jarakArr) : 0;

  return { totalSiswa, tkSiswa, sdSiswa, smpSiswa, smkSiswa, posSiswa, minJarak, maxJarak };
}

// ── Generate Preview ───────────────────────────────────────────────
function generatePreview() {
  const judul1 = document.getElementById('judulPeta').value || 'PETA JARAK DAPUR';
  const judul2 = document.getElementById('judulTabel').value || 'DATA SEKOLAH PENERIMA MANFAAT';
  const namaDapur = document.getElementById('namaDapur').value || 'Dapur SPPG';

  document.getElementById('p1_judul').textContent = judul1;
  document.getElementById('p2_judul').textContent = judul2;

  const stats = calcStats();
  document.getElementById('p1_jumlah_total').textContent = stats.totalSiswa.toLocaleString('id-ID');
  
  if (document.getElementById('p1_jumlah_tk')) document.getElementById('p1_jumlah_tk').textContent = `TK: ${stats.tkSiswa.toLocaleString('id-ID')}`;
  if (document.getElementById('p1_jumlah_sd')) document.getElementById('p1_jumlah_sd').textContent = `SD: ${stats.sdSiswa.toLocaleString('id-ID')}`;
  if (document.getElementById('p1_jumlah_smp')) document.getElementById('p1_jumlah_smp').textContent = `SMP: ${stats.smpSiswa.toLocaleString('id-ID')}`;
  if (document.getElementById('p1_jumlah_smk')) document.getElementById('p1_jumlah_smk').textContent = `SMK: ${stats.smkSiswa.toLocaleString('id-ID')}`;
  if (document.getElementById('p1_jumlah_posyandu')) document.getElementById('p1_jumlah_posyandu').textContent = `POSY: ${stats.posSiswa.toLocaleString('id-ID')}`;
  
  document.getElementById('p1_jarak_info').innerHTML = `DEKAT: ${stats.minJarak.toString().replace('.', ',')} KM<br>JAUH: ${stats.maxJarak.toString().replace('.', ',')} KM`;

  // Render labels kiri & kanan
  renderLabels();

  // Table data
  renderTable();

  // Show overlay
  document.getElementById('previewOverlay').style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Init map (delay to ensure DOM is shown)
  setTimeout(() => {
    initLeafletMap(namaDapur);
  }, 200);
}

function closePreview() {
  document.getElementById('previewOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

// ── Render sidebar labels on map page ─────────────────────────────
function renderLabels() {
  const leftSchools = schools.filter(s => s.posisi === 'kiri');
  const rightSchools = schools.filter(s => s.posisi === 'kanan');

  const buildCard = (s) => `
    <div class="label-card" style="border-left: 6px solid ${s.color}; border-color: ${s.color}; background: ${s.color}15;">
      <div class="label-name" style="color: #fff;">${s.nama}</div>
      <div class="label-siswa" style="color: ${s.color};">${(s.jumlah||0).toLocaleString('id-ID')} SISWA</div>
      <div class="label-jarak">JARAK = ${s.jarak} / ${s.waktu}' MENIT</div>
    </div>`;

  document.getElementById('labelsLeft').innerHTML = leftSchools.map(buildCard).join('');
  document.getElementById('labelsRight').innerHTML = rightSchools.map(buildCard).join('');

  // Add dapur label if right side
  const namaDapur = document.getElementById('namaDapur').value || 'Dapur SPPG';
  document.getElementById('labelsRight').innerHTML = `
    <div class="label-card type-dapur">🏠 ${namaDapur}</div>
  ` + rightSchools.map(buildCard).join('');
}

// ── Leaflet Map Init ───────────────────────────────────────────────
function initLeafletMap(namaDapur) {
  const mapEl = document.getElementById('leafletMap');
  if (!mapEl) return;

  const dapurCoords = getDapurCoords();

  // Destroy previous map
  if (leafletMap) { leafletMap.remove(); leafletMap = null; }
  mapEl.innerHTML = '';

  leafletMap = L.map('leafletMap', { zoomControl: true, attributionControl: true });

  // ESRI Satellite tile (Supports CORS for PDF Export!)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '© ESRI World Imagery'
  }).addTo(leafletMap);

  // Center dapur
  const dapurIcon = L.divIcon({
    html: `<div style="background:#ff8c00;border:3px solid #fff;width:18px;height:18px;border-radius:50%;box-shadow:0 0 12px rgba(255,140,0,0.9);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    className: ''
  });

  L.marker([dapurCoords.lat, dapurCoords.lng], { icon: dapurIcon })
    .addTo(leafletMap)
    .bindTooltip(`<b>${namaDapur}</b>`, { permanent: false, direction: 'top', className: 'dapur-tooltip' });

  // Mapping colors helper
  const getColor = (tipe) => {
    if(tipe === 'tk') return '#f1c40f';
    if(tipe === 'sd') return '#e93535';
    if(tipe === 'smp') return '#3498db';
    if(tipe === 'smk') return '#1abc9c';
    if(tipe === 'posyandu') return '#e67e22';
    return '#888';
  };

  // School markers
  schools.forEach((s, i) => {
    if (!s.lat || !s.lng) return;
    
    // Rute (Line to dapur) - Warna unik tapi terstruktur per bagian
    const lineColor = s.color;
    
    L.polyline([[dapurCoords.lat, dapurCoords.lng], [s.lat, s.lng]], {
      color: lineColor, weight: 2, dashArray: '5, 5', opacity: 0.8
    }).addTo(leafletMap);

    const schoolIcon = L.divIcon({
      html: `<div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:14px solid ${lineColor};"></div>`,
      iconSize: [16, 14],
      iconAnchor: [8, 14],
      className: ''
    });

    const marker = L.marker([s.lat, s.lng], { icon: schoolIcon }).addTo(leafletMap);
    
    // Label hanya muncul saat marker diklik
    marker.bindPopup(s.nama, { 
      className: 'map-point-label', 
      closeButton: false,
      offset: [0, -4]
    });
  });

  // Calculate Two Intersecting Radar Circles (Zona Kawasan)
  let maxDistMeters = 0;
  schools.forEach(s => {
    if (s.lat && s.lng) {
      const d = leafletMap.distance([dapurCoords.lat, dapurCoords.lng], [s.lat, s.lng]);
      if (d > maxDistMeters) maxDistMeters = d;
    }
  });

  if (maxDistMeters > 0) {
    const radiusZona = maxDistMeters * 0.65; // ~65% of max distance provides a beautiful overlap

    const circleOptions = {
      color: '#ffffff',
      fill: false,
      weight: 3,
      dashArray: '10, 15',
      opacity: 0.9
    };

    // Lingkaran 1 (Pusat Dapur)
    L.circle([dapurCoords.lat, dapurCoords.lng], { ...circleOptions, radius: radiusZona }).addTo(leafletMap);

    // Lingkaran 2 (Pusat titik kiri terjauh / rata-rata kelompok Kiri)
    const kiriSchools = schools.filter(s => s.posisi === 'kiri' && s.lat && s.lng);
    if (kiriSchools.length > 0) {
      let sumL = 0, sumLng = 0;
      kiriSchools.forEach(s => { sumL += s.lat; sumLng += s.lng; });
      const centerKiri = [sumL / kiriSchools.length, sumLng / kiriSchools.length];
      L.circle(centerKiri, { ...circleOptions, radius: radiusZona }).addTo(leafletMap);
    }
  }

  // Fit bounds to include all points
  const allPoints = [[dapurCoords.lat, dapurCoords.lng], ...schools.filter(s => s.lat && s.lng).map(s => [s.lat, s.lng])];
  if (allPoints.length > 1) {
    const bounds = L.latLngBounds(allPoints);
    leafletMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  } else {
    leafletMap.setView([dapurCoords.lat, dapurCoords.lng], 14);
  }
}


// ── Render table data ──────────────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('tableBody');
  const total = schools.reduce((a, s) => a + (s.jumlah || 0), 0);

  tbody.innerHTML = schools.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${s.nama}</td>
      <td>${s.alamat}</td>
      <td>${(s.jumlah||0).toLocaleString('id-ID')}</td>
      <td>${s.jarak}/${s.waktu}'</td>
      <td></td>
    </tr>`).join('');

  tbody.innerHTML += `
    <tr class="total-row">
      <td colspan="3" style="text-align:right;color:#ffd700 !important;font-weight:900;letter-spacing:2px;">JUMLAH</td>
      <td>${total.toLocaleString('id-ID')}</td>
      <td></td>
      <td></td>
    </tr>`;
}

// ── Export PDF ─────────────────────────────────────────────────────
async function exportPDF() {
  // Ensure preview is generated
  generatePreview();

  // Wait for map to render
  await new Promise(r => setTimeout(r, 1500));

  const loading = document.getElementById('loadingOverlay');
  loading.classList.add('show');

  const namaDapur = (document.getElementById('namaDapur').value || 'Peta_Dapur').replace(/\s+/g, '_');
  const filename = `Peta_Jarak_${namaDapur}.pdf`;

  const optFinal = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, allowTaint: false, logging: false, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  const printArea = document.getElementById('pdfPrintArea');

  // Ensure map is redrawn
  if (leafletMap) leafletMap.invalidateSize();

  const oldScroll = window.scrollY;
  window.scrollTo(0, 0);
  
  // Allow Leaflet a moment to redraw
  await new Promise(r => setTimeout(r, 500));

  try {
    // Generate PDF directly from the target area natively inside the preview overlay
    await html2pdf().set(optFinal).from(printArea).save();
  } catch (err) {
    console.error('PDF error:', err);
    alert('Gagal export PDF: ' + err.message);
  } finally {
    window.scrollTo(0, oldScroll);
    loading.classList.remove('show');
  }
}

// ── Init app on load ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderSchoolList();
  generatePreview();
});
