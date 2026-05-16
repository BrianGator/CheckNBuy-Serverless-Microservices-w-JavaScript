// Written by Brian McCarthy
import { useState, useRef } from 'react';
import { Terminal, Download, X, Monitor, Cpu, GitBranch, Layout, Play, CheckCircle, ListChecks, ShoppingCart, TableProperties } from 'lucide-react';
import { motion } from 'motion/react';

const simulations = [
  {
    id: 'product_details_deploy',
    taskNumber: 1,
    title: 'Product Details Microservice Deployment',
    type: 'terminal',
    filename: 'product_details_deploy.png',
    command: `ibmcloud ce application create --name prodlist \\
  --image us.icr.io/\${SN_ICR_NAMESPACE}/prodlist \\
  --registry-secret icr-secret \\
  --port 5000 \\
  --build-context-dir products_list \\
  --build-source https://github.com/ibm-developer-skills-network/wzpvw-dealer_evaluation_backend_js.git`,
    output: `Creating application 'prodlist'...
OK
Waiting for application 'prodlist' to become ready...
OK
Application 'prodlist' is ready.
URL: https://prodlist.us-south.codeengine.appdomain.cloud

Verification:
$ curl https://prodlist.us-south.codeengine.appdomain.cloud/api/products
[{"product": "Headphones", ...}, {"product": "Laptop", ...}]
OK`,
    icon: <Cpu className="w-5 h-5 text-green-400" />
  },
  {
    id: 'dealer_details_deploy',
    taskNumber: 2,
    title: 'Dealer Pricing Microservice Deployment',
    type: 'terminal',
    filename: 'dealer_details_deploy.png',
    command: `ibmcloud ce application create --name dealerdetails \\
  --image us.icr.io/\${SN_ICR_NAMESPACE}/dealerdetails \\
  --registry-secret icr-secret \\
  --port 8080 \\
  --build-context-dir dealer_details \\
  --build-source https://github.com/ibm-developer-skills-network/wzpvw-dealer_evaluation_backend_js.git`,
    output: `Creating application 'dealerdetails'...
OK
Waiting for application 'dealerdetails' to become ready...
OK
Application 'dealerdetails' is ready.
URL: https://dealerdetails.us-south.codeengine.appdomain.cloud

Verification:
$ curl https://dealerdetails.us-south.codeengine.appdomain.cloud/api/price/GH%20Computers/Laptop
{"message": "Laptop costs $1500 at GH Computers"}
OK`,
    icon: <Terminal className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'git_clone',
    taskNumber: 3,
    title: 'Git Repository Cloning',
    type: 'terminal',
    filename: 'git_clone.png',
    command: `cd /home/project
git clone https://github.com/ibm-developer-skills-network/pcsjq-dealer_evaluation_frontend_js.git`,
    output: `Cloning into 'pcsjq-dealer_evaluation_frontend_js'...
remote: Enumerating objects: 42, done.
remote: Counting objects: 100% (42/42), done.
remote: Compressing objects: 100% (35/35), done.
remote: Total 42 (delta 12), reused 30 (delta 5), pack-reused 0
Receiving objects: 100% (42/42), 5.21 MiB | 12.44 MiB/s, done.
Resolving deltas: 100% (12/12), done.`,
    icon: <GitBranch className="w-5 h-5 text-orange-400" />
  },
  {
    id: 'index_urlchanges',
    taskNumber: 4,
    title: 'index.html URL Changes',
    type: 'terminal',
    filename: 'index_urlchanges.png',
    command: `nano index.html`,
    output: `// index.html changes applied to point to Code Engine endpoints:

- const PRODUCT_SERVICE_URL = "http://localhost:5000/";
+ const PRODUCT_SERVICE_URL = "https://prodlist.us-south.codeengine.appdomain.cloud/";

- const PRICING_SERVICE_URL = "http://localhost:8080/";
+ const PRICING_SERVICE_URL = "https://dealerdetails.us-south.codeengine.appdomain.cloud/";

[INFO] Placeholders successfully updated.
[INFO] Deployment sync verified.`,
    icon: <Layout className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'frontend_deploy',
    taskNumber: 5,
    title: 'Frontend Microservice Deployment',
    type: 'terminal',
    filename: 'frontend_deploy.png',
    command: `ibmcloud ce application create --name frontend \\
  --image us.icr.io/\${SN_ICR_NAMESPACE}/frontend \\
  --registry-secret icr-secret \\
  --port 5001 \\
  --build-source .`,
    output: `Creating application 'frontend'...
OK
Waiting for application 'frontend' to become ready...
OK
Application 'frontend' is ready.
URL: https://frontend.us-south.codeengine.appdomain.cloud

[SYSTEM] Health Check: PASS
[SYSTEM] Auth: Active`,
    icon: <Monitor className="w-5 h-5 text-indigo-400" />
  },
  {
    id: 'homepage',
    taskNumber: 6,
    title: 'Task 6: Homepage & Preloading',
    type: 'ui',
    filename: 'homepage.png',
    uiState: {
        product: 'Select a Product...',
        dropdown: ['Headphones', 'Laptop', 'Mouse', 'Printer'],
        status: 'Microservices Polled Successfully'
    },
    icon: <Layout className="w-5 h-5 text-slate-400" />
  },
  {
    id: 'product_dealer',
    taskNumber: 7,
    title: 'Task 7: Dealer List Population',
    type: 'ui',
    filename: 'product_dealer.png',
    uiState: {
        product: 'Laptop',
        dealers: ['GH Computers', 'Tech City', 'Ez PC'],
        message: 'Supplied by 3 verified partners.'
    },
    icon: <ListChecks className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'product_dealer_price',
    taskNumber: 8,
    title: 'Task 8: Single Dealer Pricing',
    type: 'ui',
    filename: 'product_dealer_price.png',
    uiState: {
        product: 'Laptop',
        dealer: 'GH Computers',
        result: 'Laptop costs $1500 at GH Computers'
    },
    icon: <ShoppingCart className="w-5 h-5 text-green-400" />
  },
  {
    id: 'product_all_dealers_prices',
    taskNumber: 9,
    title: 'Task 9: All Dealers Comparison',
    type: 'ui',
    filename: 'product_all_dealers_prices.png',
    uiState: {
        product: 'Headphones',
        comparison: [
            { name: 'Binglee', price: '$30' },
            { name: 'DXC Electronics', price: '$20' },
            { name: 'Bobay', price: '$20' }
        ]
    },
    icon: <TableProperties className="w-5 h-5 text-red-400" />
  }
];

export function SimulationGallery({ onClose }) {
  const [activeTab, setActiveTab] = useState(simulations[0].id);
  const canvasRef = useRef(null);

  const downloadAsPng = () => {
    const active = simulations.find(s => s.id === activeTab);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set high-res dimensions
    canvas.width = 1600;
    canvas.height = 1000;
    
    // Render Background
    ctx.fillStyle = '#0F172A'; // Slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header Bar
    ctx.fillStyle = '#1E293B'; // Slate-800
    ctx.fillRect(0, 0, canvas.width, 80);
    
    // Header Text
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`${active.taskNumber}. ${active.title}`, 40, 50);
    
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'italic 20px sans-serif';
    ctx.fillText('Project Deliverable - Written by Brian McCarthy', 1100, 50);

    if (active.type === 'terminal') {
        // Terminal Window Background
        ctx.fillStyle = '#020617';
        ctx.fillRect(40, 120, 1520, 840);
        
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 120, 1520, 840);

        // Content
        ctx.fillStyle = '#4ADE80'; // Green prompt
        ctx.font = 'bold 24px monospace';
        ctx.fillText('brian@code-engine:~$ ', 70, 170);
        
        ctx.fillStyle = '#F8FAFC'; // Command
        ctx.fillText(active.command, 370, 170);
        
        ctx.fillStyle = '#CBD5E1'; // Output
        ctx.font = '22px monospace';
        const lines = active.output.split('\n');
        let currentY = 220;
        lines.forEach(line => {
            ctx.fillText(line, 70, currentY);
            currentY += 34;
        });

    } else {
        // UI Mockup Renderer
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(40, 120, 1520, 840);
        
        // App Nav
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(40, 120, 1520, 70);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('CHECKNBUY DEALER EVALUATION', 70, 165);

        // UI Elements
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(100, 250, 400, 50); // Dropdown mock
        ctx.strokeStyle = '#94A3B8';
        ctx.strokeRect(100, 250, 400, 50);
        
        ctx.fillStyle = '#1E293B';
        ctx.font = '20px sans-serif';
        ctx.fillText(`Product: ${active.uiState.product}`, 120, 282);

        if (active.uiState.dropdown) {
           ctx.fillStyle = '#FFFFFF';
           ctx.fillRect(100, 300, 400, 200);
           ctx.strokeRect(100, 300, 400, 200);
           active.uiState.dropdown.forEach((item, i) => {
               ctx.fillStyle = '#1e293B';
               ctx.fillText(item, 120, 340 + (i * 40));
           });
        }

        if (active.uiState.dealers) {
            ctx.fillStyle = '#F1F5F9';
            ctx.fillRect(550, 250, 400, 50);
            ctx.strokeRect(550, 250, 400, 50);
            ctx.fillStyle = '#1E293B';
            ctx.fillText('Select Dealer...', 570, 282);

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(550, 300, 400, 150);
            ctx.strokeRect(550, 300, 400, 150);
            active.uiState.dealers.forEach((d, i) => {
                ctx.fillStyle = '#1E293B';
                ctx.fillText(d, 570, 340 + (i * 40));
            });
        }

        if (active.uiState.result) {
            ctx.fillStyle = '#3B82F6';
            ctx.fillRect(100, 550, 1320, 100);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 32px sans-serif';
            ctx.fillText(active.uiState.result, 150, 610);
        }

        if (active.uiState.comparison) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(100, 400, 800, 300);
            ctx.strokeRect(100, 400, 800, 300);
            
            ctx.fillStyle = '#F8FAFC';
            ctx.fillRect(100, 400, 800, 50);
            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText('Dealer', 120, 432);
            ctx.fillText('Price', 600, 432);

            active.uiState.comparison.forEach((row, i) => {
                ctx.fillStyle = '#475569';
                ctx.font = '20px sans-serif';
                ctx.fillText(row.name, 120, 482 + (i * 50));
                ctx.fillText(row.price, 600, 482 + (i * 50));
            });
        }
    }

    const link = document.createElement('a');
    link.download = active.filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-12"
    >
      <div className="w-full max-w-6xl h-full bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg">
                <Play className="w-5 h-5 text-white" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Project Deliverables Hub</h2>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Written by Brian McCarthy</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-slate-700 bg-slate-800/50 overflow-y-auto p-4 hidden md:block">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Task Deliverables</h3>
            <div className="space-y-2">
              {simulations.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all border flex items-center gap-4 ${
                    activeTab === s.id 
                    ? 'bg-blue-600/10 border-blue-600/50 text-white' 
                    : 'bg-slate-700/30 border-transparent text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-[10px] font-bold border border-slate-700">
                    {s.taskNumber}
                  </span>
                  {s.icon}
                  <span className="text-xs font-bold leading-tight">{s.title.split(':').pop()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Terminal View */}
          <div className="flex-1 bg-slate-900 flex flex-col relative overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
               <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">{simulations.find(s=>s.id === activeTab).filename}</span>
               </div>
               <button 
                onClick={downloadAsPng}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95"
               >
                 <Download className="w-4 h-4" /> Download Deliverable PNG
               </button>
            </div>

            <div className="flex-1 overflow-auto p-8 font-mono text-sm leading-relaxed">
              {simulations.map(s => s.id === activeTab && (
                <motion.div 
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                     <p className="text-xs text-slate-400 mb-2 font-sans">TASK DESCRIPTION:</p>
                     <p className="text-sm text-slate-200 font-sans">{s.title}</p>
                  </div>
                  
                  {s.type === 'terminal' ? (
                     <div className="space-y-4">
                        <div className="flex gap-3">
                            <span className="text-green-400 font-bold">brian@code-engine:~$</span>
                            <span className="text-slate-50 break-all">{s.command}</span>
                        </div>
                        <div className="text-slate-300 whitespace-pre-wrap pl-4 border-l border-slate-700">
                            {s.output}
                        </div>
                     </div>
                  ) : (
                     <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-4">
                         <Monitor className="w-12 h-12 text-slate-600" />
                         <span className="text-slate-400 text-sm italic">UI Snapshot Simulation Ready for Export</span>
                     </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Hidden Canvas for Generation */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] text-center">
           Deliverable Generation System &bull; Version 2.1 &bull; Auth: B. McCarthy
        </div>
      </div>
    </motion.div>
  );
}
