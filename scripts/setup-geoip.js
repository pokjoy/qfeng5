// scripts/setup-geoip.js
// 用于下载和设置GeoIP数据库的脚本

const fs = require('fs')
const path = require('path')
const https = require('https')
const { createGunzip } = require('zlib')
const { pipeline } = require('stream')

// 创建必要的目录
function createDirectories() {
  const srcDir = path.join(process.cwd(), 'src')
  const dataDir = path.join(srcDir, 'data')
  const geoipDir = path.join(dataDir, 'geoip')
  
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir)
    console.log('✓ 创建 src 目录')
  }
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir)
    console.log('✓ 创建 src/data 目录')
  }
  
  if (!fs.existsSync(geoipDir)) {
    fs.mkdirSync(geoipDir)
    console.log('✓ 创建 src/data/geoip 目录')
  }
  
  return geoipDir
}

// 下载GeoLite2数据库
async function downloadGeoIPDatabase(geoipDir) {
  console.log('📥 开始下载 GeoLite2-Country 数据库...')
  console.log('⚠️  注意：你需要在 MaxMind 注册账户并获取许可证密钥')
  console.log('   访问：https://www.maxmind.com/en/geolite2/signup')
  console.log('')
  
  // 提示用户手动下载（因为需要注册账户）
  console.log('📋 请按以下步骤操作：')
  console.log('1. 注册 MaxMind 账户（免费）')
  console.log('2. 登录后下载 GeoLite2 Country 数据库')
  console.log('3. 解压后将 GeoLite2-Country.mmdb 文件放置到：')
  console.log('   ' + path.join(geoipDir, 'GeoLite2-Country.mmdb'))
  console.log('   (即: src/data/geoip/GeoLite2-Country.mmdb)')
  console.log('')
  
  // 创建空的last-updated.txt文件
  const updateFile = path.join(geoipDir, 'last-updated.txt')
  fs.writeFileSync(updateFile, new Date().toISOString())
  console.log('✓ 创建更新时间记录文件')
  
  // 检查是否已经有数据库文件
  const dbFile = path.join(geoipDir, 'GeoLite2-Country.mmdb')
  if (fs.existsSync(dbFile)) {
    console.log('✓ 发现现有的 GeoLite2-Country.mmdb 文件')
    return true
  } else {
    console.log('❌ 未找到 GeoLite2-Country.mmdb 文件')
    console.log('   请按上述步骤手动下载并放置到正确位置')
    return false
  }
}

// 验证数据库文件
async function validateDatabase(geoipDir) {
  const dbFile = path.join(geoipDir, 'GeoLite2-Country.mmdb')
  
  if (!fs.existsSync(dbFile)) {
    console.log('❌ 数据库文件不存在')
    return false
  }
  
  try {
    // 使用正确的导入方式
    const { Reader } = require('@maxmind/geoip2-node')
    
    // 检查导入是否成功
    if (!Reader || typeof Reader.open !== 'function') {
      console.log('❌ MaxMind 库导入失败或版本不兼容')
      console.log('   当前安装的版本可能不支持此导入方式')
      return false
    }
    
    const reader = await Reader.open(dbFile)
    
    // 测试查询一些已知IP
    const testIPs = [
      '8.8.8.8',      // 美国 Google DNS
      '1.1.1.1',      // 美国 Cloudflare
      '114.114.114.114' // 中国 114 DNS
    ]
    
    console.log('🧪 测试数据库查询...')
    for (const ip of testIPs) {
      try {
        const result = reader.country(ip)
        console.log(`   ${ip} -> ${result.country?.isoCode || 'Unknown'}`)
      } catch (error) {
        console.log(`   ${ip} -> 查询失败: ${error.message}`)
      }
    }
    
    console.log('✓ 数据库验证通过')
    return true
  } catch (error) {
    console.log('❌ 数据库验证失败:', error.message)
    
    if (error.message.includes('Cannot find module')) {
      console.log('💡 请先安装依赖: npm install @maxmind/geoip2-node')
    } else if (error.message.includes('Reader')) {
      console.log('💡 可能是版本兼容性问题，尝试重新安装:')
      console.log('   npm uninstall @maxmind/geoip2-node')
      console.log('   npm install @maxmind/geoip2-node@latest')
    }
    
    return false
  }
}

// 主函数
async function main() {
  console.log('🚀 开始设置 GeoIP 数据库...')
  console.log('')
  
  try {
    // 1. 创建目录
    const geoipDir = createDirectories()
    
    // 2. 下载数据库（实际上是提示用户手动下载）
    await downloadGeoIPDatabase(geoipDir)
    
    // 3. 验证数据库
    const isValid = await validateDatabase(geoipDir)
    
    console.log('')
    if (isValid) {
      console.log('🎉 GeoIP 数据库设置完成！')
      console.log('现在可以使用 /api/get-currency 接口了')
    } else {
      console.log('⚠️  设置未完成，请检查数据库文件')
    }
  } catch (error) {
    console.error('❌ 设置过程中出现错误:', error)
  }
}

// 运行脚本
if (require.main === module) {
  main()
}

module.exports = { main }