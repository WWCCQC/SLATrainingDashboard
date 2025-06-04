// script.js - Navigation System Only

// Navigation and Section Management
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.content-section');
        
        // ตรวจสอบว่ามี navigation elements หรือไม่
        if (this.navLinks.length > 0 && this.sections.length > 0) {
            this.init();
        } else {
            console.warn('Navigation elements not found');
        }
    }

    init() {
        this.bindEvents();
        this.setInitialState();
    }

    bindEvents() {
        this.navLinks.forEach(link => {
            // ใช้ namespace เพื่อไม่ให้กระทบกับ event listeners อื่น
            link.addEventListener('click', (e) => this.handleNavClick(e), { passive: false });
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        
        const targetSection = e.target.getAttribute('data-section');
        
        // Update navigation state
        this.updateNavState(e.target);
        
        // Switch sections
        this.switchSection(targetSection);
        
        // Update page title
        this.updatePageTitle(targetSection);
        
        // Trigger custom event for section change
        this.triggerSectionChangeEvent(targetSection);
    }

    updateNavState(activeLink) {
        // Remove active class from all nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked nav link
        activeLink.classList.add('active');
    }

    switchSection(targetSectionId) {
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetElement = document.getElementById(targetSectionId);
        if (targetElement) {
            targetElement.classList.add('active');
        }
    }

    updatePageTitle(sectionId) {
        const titles = {
            'training-status': 'ข้อมูลแดชบอร์ดสถานะการอบรมช่างใหม่(2025)',
            'remain-par-group-code': 'ข้อมูลแดชบอร์ด - Remain Par By Group Code (2025)',
            'remain-par-group-team': 'ข้อมูลแดชบอร์ด - Remain Par By Group-Team (2025)'
        };
        
        const headerTitle = document.querySelector('.header-container h1');
        const newTitle = titles[sectionId] || 'ข้อมูลแดชบอร์ดสถานะการอบรมช่างใหม่(2025)';
        
        if (headerTitle) {
            headerTitle.textContent = newTitle;
        }
    }

    setInitialState() {
        // ไม่ต้องเปลี่ยน title เพราะจะกระทบกับ title เดิม
        // this.updatePageTitle('training-status');
        
        // Ensure training-status section is active by default
        const trainingStatusSection = document.getElementById('training-status');
        if (trainingStatusSection) {
            trainingStatusSection.classList.add('active');
        }
    }

    triggerSectionChangeEvent(sectionId) {
        // Dispatch custom event for other scripts to listen to
        const event = new CustomEvent('sectionChanged', {
            detail: { sectionId: sectionId }
        });
        document.dispatchEvent(event);
    }

    // Public method to programmatically switch sections
    switchToSection(sectionId) {
        const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetLink) {
            this.updateNavState(targetLink);
            this.switchSection(sectionId);
            this.updatePageTitle(sectionId);
            this.triggerSectionChangeEvent(sectionId);
        }
    }

    // Get current active section
    getCurrentSection() {
        const activeSection = document.querySelector('.content-section.active');
        return activeSection ? activeSection.id : null;
    }
}

// Section Content Manager
class SectionContentManager {
    constructor() {
        this.init();
    }

    init() {
        // Listen for section changes
        document.addEventListener('sectionChanged', (e) => {
            this.handleSectionChange(e.detail.sectionId);
        });
    }

    handleSectionChange(sectionId) {
        console.log(`Switched to section: ${sectionId}`);
        
        // Handle specific section logic
        switch(sectionId) {
            case 'training-status':
                this.loadTrainingStatusContent();
                break;
            case 'remain-par-group-code':
                this.loadRemainParGroupCodeContent();
                break;
            case 'remain-par-group-team':
                this.loadRemainParGroupTeamContent();
                break;
        }
        
        // Scroll to top when switching sections
        NavigationUtils.scrollToTop();
    }

    loadTrainingStatusContent() {
        // Content is already loaded in HTML
        // This method can be used for dynamic loading if needed
        console.log('Training Status content loaded');
    }

    loadRemainParGroupCodeContent() {
        console.log('Loading Remain Par By Group Code content...');
        
        // แสดง loading indicator
        this.showLoadingIndicator('remain-par-group-code');
        
        // รอให้ DOM พร้อม แล้วค่อยโหลดข้อมูล
        setTimeout(() => {
            if (typeof window.loadGroupCodeData === 'function') {
                console.log('Calling loadGroupCodeData function...');
                window.loadGroupCodeData();
            } else {
                console.warn('loadGroupCodeData function not found, will try again...');
                // ลองอีกครั้งหลังจาก 500ms
                setTimeout(() => {
                    if (typeof window.loadGroupCodeData === 'function') {
                        console.log('Retrying loadGroupCodeData function...');
                        window.loadGroupCodeData();
                    } else {
                        console.error('loadGroupCodeData function still not available');
                        this.hideLoadingIndicator('remain-par-group-code');
                    }
                }, 500);
            }
        }, 200); // รอ 200ms เพื่อให้ section แสดงผลเสร็จก่อน
    }

    showLoadingIndicator(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('loading');
            
            // เพิ่ม loading message
            const loadingDiv = document.createElement('div');
            loadingDiv.id = `${sectionId}-loading`;
            loadingDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 51, 102, 0.9);
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 1000;
                text-align: center;
            `;
            loadingDiv.innerHTML = `
                <div style="margin-bottom: 10px;">กำลังโหลดข้อมูล...</div>
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #003366; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            `;
            document.body.appendChild(loadingDiv);
        }
    }

    hideLoadingIndicator(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('loading');
            
            // ลบ loading message
            const loadingDiv = document.getElementById(`${sectionId}-loading`);
            if (loadingDiv) {
                loadingDiv.remove();
            }
        }
    }

    loadRemainParGroupTeamContent() {
        // Placeholder for future content loading
        console.log('Remain Par By Group-Team content loaded');
        
        // Example: You can add dynamic content loading here
        // this.createGroupTeamDashboard();
    }

    // Example method for creating dynamic content
    createGroupCodeDashboard() {
        const section = document.getElementById('remain-par-group-code');
        const placeholderContent = section.querySelector('.placeholder-content');
        
        if (placeholderContent) {
            placeholderContent.innerHTML = `
                <div class="dashboard-content">
                    <h3>Group Code Dashboard</h3>
                    <p>Dynamic content will be loaded here</p>
                </div>
            `;
        }
    }

    createGroupTeamDashboard() {
        const section = document.getElementById('remain-par-group-team');
        const placeholderContent = section.querySelector('.placeholder-content');
        
        if (placeholderContent) {
            placeholderContent.innerHTML = `
                <div class="dashboard-content">
                    <h3>Group-Team Dashboard</h3>
                    <p>Dynamic content will be loaded here</p>
                </div>
            `;
        }
    }
}

// Utility functions
const NavigationUtils = {
    // Smooth scroll to top when switching sections
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    // Show loading indicator
    showLoading(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('loading');
        }
    },

    // Hide loading indicator
    hideLoading(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('loading');
        }
    }
};

// Initialize navigation system when DOM is loaded
// ใช้ setTimeout เพื่อให้ JavaScript หลักโหลดเสร็จก่อน
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Initialize navigation manager
        window.navigationManager = new NavigationManager();
        
        // Initialize section content manager
        window.sectionContentManager = new SectionContentManager();
        
        console.log('Navigation system initialized');
    }, 100); // รอ 100ms เพื่อให้ JavaScript หลักโหลดเสร็จ
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NavigationManager,
        SectionContentManager,
        NavigationUtils
    };
}