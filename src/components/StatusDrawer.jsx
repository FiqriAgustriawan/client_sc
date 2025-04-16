import { FiX, FiChevronRight, FiAlertCircle, FiCheckCircle, FiFlag, FiArrowRight } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const StatusDrawer = ({ isOpen, onClose, type, status }) => {
  const [activeTab, setActiveTab] = useState(0)
  
  const statusInfo = {
    gunung: {
      mudah: {
        title: "Status Gunung - Mudah",
        icon: <FiCheckCircle className="w-6 h-6 text-green-500" />,
        color: "green",
        description: "Gunung dengan tingkat kesulitan rendah, cocok untuk pemula",
        details: [
          { title: "Medan", desc: "Relatif landai dan mudah dilalui" },
          { title: "Jalur", desc: "Jelas dan terawat dengan baik" },
          { title: "Waktu Tempuh", desc: "2-4 jam pendakian" },
          { title: "Peralatan", desc: "Peralatan dasar pendakian" },
          { title: "Persiapan", desc: "Persiapan fisik minimal" }
        ]
      },
      menengah: {
        title: "Status Gunung - Menengah",
        icon: <FiAlertCircle className="w-6 h-6 text-yellow-500" />,
        color: "yellow",
        description: "Gunung dengan tantangan moderat, perlu pengalaman dasar",
        details: [
          { title: "Medan", desc: "Cukup terjal dengan beberapa tantangan" },
          { title: "Jalur", desc: "Beberapa jalur teknis" },
          { title: "Waktu Tempuh", desc: "4-6 jam pendakian" },
          { title: "Peralatan", desc: "Peralatan lengkap pendakian" },
          { title: "Persiapan", desc: "Persiapan fisik yang baik" }
        ]
      },
      sulit: {
        title: "Status Gunung - Sulit",
        icon: <FiFlag className="w-6 h-6 text-red-500" />,
        color: "red",
        description: "Gunung dengan tingkat kesulitan tinggi, butuh keahlian khusus",
        details: [
          { title: "Medan", desc: "Sangat terjal dan berbahaya" },
          { title: "Jalur", desc: "Jalur teknis yang kompleks" },
          { title: "Waktu Tempuh", desc: "6+ jam pendakian" },
          { title: "Peralatan", desc: "Peralatan teknis khusus" },
          { title: "Persiapan", desc: "Persiapan fisik dan mental maksimal" }
        ]
      }
    },
    pendakian: {
      // Similar structure for pendakian status...
      pemula: {
        title: "Level Pendaki - Pemula",
        icon: <FiCheckCircle className="w-6 h-6 text-green-500" />,
        color: "green",
        description: "Cocok untuk pendaki pertama kali",
        details: [
          { title: "Pengalaman", desc: "Tidak memerlukan pengalaman khusus" },
          { title: "Peralatan", desc: "Peralatan standar pendakian" },
          { title: "Panduan", desc: "Pendampingan guide disarankan" },
          { title: "Fisik", desc: "Persiapan fisik dasar" },
          { title: "Teknik", desc: "Teknik dasar pendakian" }
        ]
      },
      mahir: {
        title: "Level Pendaki - Mahir",
        icon: <FiAlertCircle className="w-6 h-6 text-yellow-500" />,
        color: "yellow",
        description: "Untuk pendaki dengan pengalaman memadai",
        details: [
          { title: "Pengalaman", desc: "Minimal 5 pendakian" },
          { title: "Peralatan", desc: "Peralatan lengkap dan teknis" },
          { title: "Panduan", desc: "Mampu mandiri" },
          { title: "Fisik", desc: "Stamina yang baik" },
          { title: "Teknik", desc: "Menguasai teknik dasar" }
        ]
      },
      ahli: {
        title: "Level Pendaki - Ahli",
        icon: <FiFlag className="w-6 h-6 text-red-500" />,
        color: "red",
        description: "Khusus pendaki berpengalaman tinggi",
        details: [
          { title: "Pengalaman", desc: "Berpengalaman berbagai kondisi" },
          { title: "Peralatan", desc: "Peralatan teknis lengkap" },
          { title: "Panduan", desc: "Dapat memimpin tim" },
          { title: "Fisik", desc: "Stamina sangat baik" },
          { title: "Teknik", desc: "Ahli teknik pendakian" }
        ]
      }
    }
  }

  const info = type === 'gunung' ? statusInfo.gunung[status] : statusInfo.pendakian[status]
  
  // Custom color classes to avoid Tailwind purge issues
  const getBgColor = (color) => {
    const colors = {
      green: 'bg-green-50',
      yellow: 'bg-yellow-50',
      red: 'bg-red-50'
    }
    return colors[color] || 'bg-gray-50'
  }
  
  const getBorderColor = (color) => {
    const colors = {
      green: 'border-green-200',
      yellow: 'border-yellow-200',
      red: 'border-red-200'
    }
    return colors[color] || 'border-gray-200'
  }
  
  const getTextColor = (color) => {
    const colors = {
      green: 'text-green-500',
      yellow: 'text-yellow-500',
      red: 'text-red-500'
    }
    return colors[color] || 'text-gray-500'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              mass: 0.8
            }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 rounded-l-3xl overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header with glass effect */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`sticky top-0 z-10 px-6 py-5 backdrop-blur-md bg-white/90 border-b ${getBorderColor(info.color)}`}
              >
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      delay: 0.3,
                      duration: 0.5
                    }}
                    className={`p-3 rounded-full ${getBgColor(info.color)}`}
                  >
                    {info.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold">{info.title}</h3>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </div>
                </div>
                
                {/* Tab navigation */}
                <div className="flex space-x-2 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(0)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 0 
                      ? `${getBgColor(info.color)} ${getTextColor(info.color)}` 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Detail
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 1 
                      ? `${getBgColor(info.color)} ${getTextColor(info.color)}` 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Tips
                  </motion.button>
                </div>
              </motion.div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 0 ? (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 space-y-4"
                    >
                      {info.details.map((detail, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-5 rounded-xl border ${getBorderColor(info.color)} ${getBgColor(info.color)} shadow-sm`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTextColor(info.color)} bg-white`}>
                              {index + 1}
                            </div>
                            <h4 className="font-medium text-gray-900">{detail.title}</h4>
                          </div>
                          <p className="text-gray-600 ml-11">{detail.desc}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="tips"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      <div className={`p-5 rounded-xl ${getBgColor(info.color)} mb-6`}>
                        <h3 className="font-semibold mb-2">Tips untuk {info.title.split(' - ')[1]}</h3>
                        <p className="text-gray-600 text-sm">Berikut adalah beberapa tips yang dapat membantu Anda:</p>
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          "Persiapkan fisik dan mental sebelum pendakian",
                          "Bawa perlengkapan sesuai dengan tingkat kesulitan",
                          "Selalu cek prakiraan cuaca sebelum mendaki",
                          "Jangan mendaki sendirian, minimal berdua",
                          "Bawa persediaan air dan makanan yang cukup"
                        ].map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <FiArrowRight className={`mt-1 ${getTextColor(info.color)}`} />
                            <p>{tip}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Footer */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-6 border-t"
              >
                <button
                  onClick={onClose}
                  className={`w-full py-3 rounded-xl font-medium text-white transition-transform active:scale-95 ${
                    info.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                    info.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                    'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Tutup
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default StatusDrawer