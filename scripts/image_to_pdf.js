// Convertofy - Image to PDF Converter

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('dropArea');
    const imagePreview = document.getElementById('imagePreview');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const previewBtn = document.getElementById('previewBtn');
    const pdfNameInput = document.getElementById('pdfName');
    const pageSizeSelect = document.getElementById('pageSize');
    const pageOrientationSelect = document.getElementById('pageOrientation');
    const imageQualitySelect = document.getElementById('imageQuality');
    const marginTopInput = document.getElementById('marginTop');
    const marginBottomInput = document.getElementById('marginBottom');
    const marginLeftInput = document.getElementById('marginLeft');
    const marginRightInput = document.getElementById('marginRight');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const progressText = document.getElementById('progressText');
    const fileList = document.getElementById('fileList');
    const fileCount = document.querySelector('.file-count');
    
    // Variables
    let images = [];
    let dragSrcEl = null;
    
    // Page size mappings
    const pageSizes = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 },
        legal: { width: 216, height: 356 },
        a5: { width: 148, height: 210 }
    };
    
    // Event listener untuk area upload
    dropArea.addEventListener('click', (e) => {
        if (e.target === dropArea || e.target.classList.contains('upload-text') || 
            e.target.classList.contains('upload-icon') || e.target.closest('.upload-icon')) {
            fileInput.click();
        }
    });
    
    // Drag & drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight area saat drag over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('dragover');
        dropArea.style.borderColor = 'var(--primary)';
        dropArea.style.backgroundColor = 'rgba(67, 97, 238, 0.05)';
    }
    
    function unhighlight() {
        dropArea.classList.remove('dragover');
        dropArea.style.borderColor = '';
        dropArea.style.backgroundColor = '';
    }
    
    // Tangani drop file
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    // Tangani pemilihan file dari input
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFiles(this.files);
        }
        this.value = '';
    });
    
    // Fungsi untuk menangani file yang dipilih
    function handleFiles(files) {
        if (!files || !files.length) return;
        
        // Filter hanya file gambar
        const imageFiles = Array.from(files).filter(file => {
            const fileType = file.type.toLowerCase();
            const fileName = file.name.toLowerCase();
            return fileType === 'image/png' || 
                   fileType === 'image/jpeg' || 
                   fileType === 'image/jpg' ||
                   fileName.endsWith('.png') ||
                   fileName.endsWith('.jpg') ||
                   fileName.endsWith('.jpeg');
        });
        
        if (imageFiles.length === 0) {
            showNotification('Silakan pilih file gambar (PNG atau JPG)', 'error');
            return;
        }
        
        // Batasi jumlah file
        if (images.length + imageFiles.length > 20) {
            showNotification('Maksimal 20 file dapat diunggah sekaligus', 'warning');
            return;
        }
        
        // Hitung total file yang akan diproses
        let filesProcessed = 0;
        const totalFiles = imageFiles.length;
        
        // Tambahkan gambar ke array
        imageFiles.forEach(file => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                images.push({
                    id: imageId,
                    file: file,
                    url: e.target.result,
                    name: file.name,
                    size: formatFileSize(file.size),
                    order: images.length + 1
                });
                
                filesProcessed++;
                
                // Update preview hanya setelah semua file diproses
                if (filesProcessed === totalFiles) {
                    updatePreview();
                    updateButtons();
                    showNotification(`${totalFiles} file berhasil diunggah`, 'success');
                }
            };
            
            reader.onerror = function() {
                filesProcessed++;
                showNotification(`Gagal membaca file: ${file.name}`, 'error');
                
                if (filesProcessed === totalFiles) {
                    if (images.length > 0) {
                        updatePreview();
                        updateButtons();
                    }
                }
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // Fungsi untuk memperbarui pratinjau gambar
    function updatePreview() {
        if (!imagePreview) return;
        
        imagePreview.innerHTML = '';
        
        if (images.length === 0) {
            fileList.classList.add('d-none');
            return;
        }
        
        fileList.classList.remove('d-none');
        fileCount.textContent = `${images.length} file`;
        
        images.forEach((image, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.setAttribute('data-id', image.id);
            fileItem.setAttribute('draggable', 'true');
            fileItem.setAttribute('data-index', index);
            
            fileItem.innerHTML = `
                <div class="position-relative">
                    <img src="${image.url}" alt="${image.name}" class="file-preview">
                    <div class="file-order">${index + 1}</div>
                </div>
                <div class="file-info">
                    <div class="file-name" title="${image.name}">${truncateText(image.name, 15)}</div>
                    <div class="file-size text-muted small">${image.size}</div>
                </div>
                <div class="file-remove" data-id="${image.id}" title="Hapus file">
                    <i class="bi bi-x-circle"></i>
                </div>
            `;
            
            imagePreview.appendChild(fileItem);
            
            // Tambahkan event listener untuk drag & drop
            addDragListeners(fileItem);
        });
        
        // Tambahkan event listener untuk tombol hapus
        attachRemoveListeners();
    }
    
    // Fungsi untuk menambahkan event listener pada tombol hapus
    function attachRemoveListeners() {
        const removeButtons = document.querySelectorAll('.file-remove');
        
        removeButtons.forEach(button => {
            // Hapus event listener yang lama jika ada
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Tambahkan event listener baru
            newButton.addEventListener('click', handleRemoveClick);
        });
    }
    
    // Fungsi untuk menangani klik tombol hapus
    function handleRemoveClick(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        if (id) {
            removeFile(id);
        }
    }
    
    // Fungsi untuk menghapus file
    function removeFile(id) {
        // Cari index gambar yang akan dihapus
        const index = images.findIndex(image => image.id === id);
        
        if (index !== -1) {
            const imageName = images[index].name;
            images.splice(index, 1);
            
            // Update order untuk semua gambar
            images.forEach((image, idx) => {
                image.order = idx + 1;
            });
            
            updatePreview();
            updateButtons();
            showNotification(`"${truncateText(imageName, 20)}" telah dihapus`, 'info');
        }
    }
    
    // Drag & drop untuk mengurutkan file
    function addDragListeners(element) {
        element.addEventListener('dragstart', handleDragStart, false);
        element.addEventListener('dragover', handleDragOver, false);
        element.addEventListener('dragleave', handleDragLeave, false);
        element.addEventListener('dragend', handleDragEnd, false);
        element.addEventListener('drop', handleDropSort, false);
    }
    
    function handleDragStart(e) {
        dragSrcEl = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }
    
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('sortable-chosen');
        return false;
    }
    
    function handleDragLeave(e) {
        this.classList.remove('sortable-chosen');
    }
    
    function handleDragEnd(e) {
        const items = document.querySelectorAll('.file-item');
        items.forEach(item => {
            item.classList.remove('dragging');
            item.classList.remove('sortable-chosen');
        });
    }
    
    function handleDropSort(e) {
        e.stopPropagation();
        
        if (dragSrcEl !== this) {
            dragSrcEl.classList.remove('dragging');
            this.classList.remove('sortable-chosen');
            
            // Dapatkan index dari elemen yang di drag dan di drop
            const dragIndex = parseInt(dragSrcEl.getAttribute('data-index'));
            const dropIndex = parseInt(this.getAttribute('data-index'));
            
            // Tukar posisi dalam array
            const temp = images[dragIndex];
            images[dragIndex] = images[dropIndex];
            images[dropIndex] = temp;
            
            // Update order dan data-index
            images.forEach((image, index) => {
                image.order = index + 1;
            });
            
            // Update preview
            updatePreview();
            showNotification('Urutan file berhasil diubah', 'success');
        }
        
        return false;
    }
    
    // Event delegation untuk tombol hapus
    document.addEventListener('click', function(e) {
        if (e.target.closest('.file-remove')) {
            const removeBtn = e.target.closest('.file-remove');
            const id = removeBtn.getAttribute('data-id');
            if (id) {
                removeFile(id);
            }
        }
    });
    
    // Fungsi untuk memperbarui status tombol
    function updateButtons() {
        if (images.length > 0) {
            convertBtn.disabled = false;
            previewBtn.disabled = false;
            clearBtn.disabled = false;
        } else {
            convertBtn.disabled = true;
            previewBtn.disabled = true;
            clearBtn.disabled = true;
        }
    }
    
    // Event listener untuk tombol clear
    clearBtn.addEventListener('click', function() {
        if (images.length === 0) return;
        
        if (confirm(`Apakah Anda yakin ingin menghapus ${images.length} file?`)) {
            images = [];
            updatePreview();
            updateButtons();
            progressContainer.classList.add('d-none');
            showNotification('Semua file telah dihapus', 'info');
        }
    });
    
    // Event listener untuk tombol preview
    previewBtn.addEventListener('click', function() {
        if (images.length === 0) {
            showNotification('Silakan upload gambar terlebih dahulu', 'warning');
            return;
        }
        
        showNotification('Fitur pratinjau akan segera hadir', 'info');
    });
    
    // Event listener untuk tombol convert
    convertBtn.addEventListener('click', convertToPDF);
    
    // Fungsi untuk mengonversi gambar ke PDF
    async function convertToPDF() {
        if (images.length === 0) {
            showNotification('Silakan pilih gambar terlebih dahulu', 'warning');
            return;
        }
        
        // Tampilkan progress bar
        progressContainer.classList.remove('d-none');
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';
        progressText.textContent = 'Menyiapkan file untuk konversi...';
        convertBtn.disabled = true;
        previewBtn.disabled = true;
        clearBtn.disabled = true;
        
        try {
            // Inisialisasi jsPDF
            const { jsPDF } = window.jspdf;
            
            // Dapatkan pengaturan
            const pageSize = pageSizeSelect.value;
            const orientation = pageOrientationSelect.value;
            const quality = parseFloat(imageQualitySelect.value);
            const margins = {
                top: parseInt(marginTopInput.value) || 10,
                bottom: parseInt(marginBottomInput.value) || 10,
                left: parseInt(marginLeftInput.value) || 10,
                right: parseInt(marginRightInput.value) || 10
            };
            
            // Buat PDF baru dengan pengaturan
            const pdf = new jsPDF({
                orientation: orientation,
                unit: 'mm',
                format: pageSize
            });
            
            // Dapatkan dimensi halaman
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Area gambar yang tersedia setelah margin
            const contentWidth = pageWidth - margins.left - margins.right;
            const contentHeight = pageHeight - margins.top - margins.bottom;
            
            // Konversi setiap gambar
            for (let i = 0; i < images.length; i++) {
                // Update progress
                const progress = Math.round(((i + 1) / images.length) * 100);
                progressBar.style.width = `${progress}%`;
                progressPercent.textContent = `${progress}%`;
                progressText.textContent = `Mengonversi gambar ${i + 1} dari ${images.length}...`;
                
                // Tambah halaman baru kecuali untuk halaman pertama
                if (i > 0) {
                    pdf.addPage();
                }
                
                // Dapatkan dimensi gambar
                const img = new Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = images[i].url;
                });
                
                // Hitung skala untuk menyesuaikan gambar dengan area konten
                const imgWidth = img.width;
                const imgHeight = img.height;
                
                let width = contentWidth;
                let height = (imgHeight * width) / imgWidth;
                
                // Jika gambar terlalu tinggi, sesuaikan dengan tinggi konten
                if (height > contentHeight) {
                    height = contentHeight;
                    width = (imgWidth * height) / imgHeight;
                }
                
                // Hitung posisi tengah
                const x = margins.left + (contentWidth - width) / 2;
                const y = margins.top + (contentHeight - height) / 2;
                
                // Tambahkan gambar ke PDF dengan kualitas yang dipilih
                pdf.addImage(images[i].url, 'JPEG', x, y, width, height, undefined, 'FAST');
            }
            
            // Update progress ke 100%
            progressBar.style.width = '100%';
            progressPercent.textContent = '100%';
            progressText.textContent = 'Konversi selesai! Mengunduh file...';
            
            // Simpan PDF dengan nama yang ditentukan pengguna
            const pdfFileName = pdfNameInput.value.trim() || 'convertify-document';
            pdf.save(`${pdfFileName}.pdf`);
            
            // Reset progress setelah beberapa saat
            setTimeout(() => {
                progressContainer.classList.add('d-none');
                convertBtn.disabled = false;
                previewBtn.disabled = false;
                clearBtn.disabled = false;
                
                // Tampilkan pesan sukses
                showNotification('Konversi berhasil! File PDF telah diunduh.', 'success');
            }, 1500);
            
        } catch (error) {
            console.error('Error during conversion:', error);
            progressText.textContent = 'Terjadi kesalahan saat konversi.';
            progressBar.style.width = '0%';
            progressPercent.textContent = '0%';
            convertBtn.disabled = false;
            previewBtn.disabled = false;
            clearBtn.disabled = false;
            
            setTimeout(() => {
                progressContainer.classList.add('d-none');
            }, 3000);
            
            showNotification('Terjadi kesalahan saat mengonversi gambar. Silakan coba lagi.', 'error');
        }
    }
    
    // Fungsi untuk menampilkan notifikasi
    function showNotification(message, type = 'info') {
        // Hapus notifikasi sebelumnya jika ada
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Buat elemen notifikasi
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Ikon berdasarkan tipe
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'x-circle';
        if (type === 'warning') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="bi bi-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Tambahkan ke body
        document.body.appendChild(notification);
        
        // Tampilkan notifikasi
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hapus notifikasi setelah 3 detik
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Fungsi utilitas: format ukuran file
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    // Fungsi utilitas: potong teks
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    // Validasi input margin
    [marginTopInput, marginBottomInput, marginLeftInput, marginRightInput].forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 0) {
                this.value = 0;
            } else if (value > 50) {
                this.value = 50;
                showNotification('Margin maksimal 50mm', 'warning');
            }
        });
    });
    
    // Update year in footer
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('footer p');
    yearElements.forEach(element => {
        if (element.textContent.includes('2023')) {
            element.textContent = element.textContent.replace('2023', currentYear);
        }
    });
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});