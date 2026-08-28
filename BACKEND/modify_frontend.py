import os

file_path = "c:/KrishiRakshak-AI-main/FRONTEND/components/dashboard/lose-less.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the runAIAnalysis function with one that fetches from our real backend!
old_logic = """  // 5. THE DECISION LOGIC ENGINE
  const runAIAnalysis = (data: typeof decisionData) => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const curPrice = parseInt(data.currentPrice) || 0
      const expPrice = parseInt(data.expectedPrice) || 0
      const profitMargin = expPrice - curPrice

      // AI Determines the status mathematically
      let finalStatus: 'sell' | 'store' | 'process' | 'pool' = 'store'
      
      if (curPrice >= expPrice) {
        finalStatus = 'sell'
      } else if (data.storageAvailable === 'Yes' && profitMargin > parseInt(data.storageCost)) {
        finalStatus = 'store'
      } else if (parseInt(data.distance) > 40 && profitMargin > 0) {
        finalStatus = 'pool'
      } else {
        finalStatus = 'process'
      }

      // Generate the translated explanation
      let whyText = ''
      let actionTitle = ''
      
      if (finalStatus === 'sell') {
        whyText = t.whySell(data.currentPrice, data.storageCost, data.spoilageProb)
        actionTitle = t.sellNow
      } else if (finalStatus === 'store') {
        whyText = t.whyStore(data.expectedPrice, data.storageCost, profitMargin, data.distance)
        actionTitle = t.storePool
      } else if (finalStatus === 'pool') {
        whyText = t.whyStore(data.expectedPrice, data.storageCost, profitMargin, data.distance)
        actionTitle = t.storePool
      } else {
        whyText = t.whyProcess(data.spoilageProb, data.currentPrice, data.crop)
        actionTitle = t.processDry
      }

      setAiResult({
        status: finalStatus,
        action: actionTitle,
        why: whyText
      })
      
      setIsCalculating(false)
    }, 2500)
  }"""

new_logic = """  // 5. REAL LOCAL AI DECISION ENGINE
  const runAIAnalysis = async (data: typeof decisionData) => {
    setIsCalculating(true)
    try {
      const response = await fetch('http://localhost:8000/api/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data,
          lang: lang
        })
      })
      
      const responseData = await response.json()
      
      if (responseData.status === 'success') {
        const result = responseData.result
        
        setAiResult({
          status: result.status as 'sell' | 'store' | 'process' | 'pool',
          action: result.action,
          why: result.why
        })
      } else {
        console.error("AI Error:", responseData.error)
        setAiResult({
          status: 'sell',
          action: 'ERROR',
          why: 'Failed to contact Local AI Engine. Please check backend.'
        })
      }
    } catch (err) {
      console.error("Network Error:", err)
      setAiResult({
        status: 'sell',
        action: 'NETWORK ERROR',
        why: 'Backend server is unreachable.'
      })
    } finally {
      setIsCalculating(false)
    }
  }"""

content = content.replace(old_logic, new_logic)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated lose-less.tsx successfully.")
