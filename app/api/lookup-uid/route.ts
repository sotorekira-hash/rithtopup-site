// Game UID lookup service
// This simulates checking player names from game APIs
// In production, replace with actual game API calls

interface GameLookupConfig {
  apiUrl?: string
  apiKey?: string
  mockNames?: string[]
}

const gameConfigs: Record<string, GameLookupConfig> = {
  mlbb: {
    mockNames: ['GamerPro', 'LegendKiller', 'DarkLord', 'DiamondMaster', 'ML_Champion'],
  },
  freefire: {
    mockNames: ['FF_Elite', 'HeadshotKing', 'BattleMaster', 'SurvivorPro', 'FF_Sniper'],
  },
  pubg: {
    mockNames: ['PUBG_Warrior', 'ChickenDinner', 'SniperElite', 'BattleRoyale', 'PUBG_Legend'],
  },
  genshin: {
    mockNames: ['Traveler', 'LumineMain', 'AetherMain', 'GanyuLover', 'ArchonHunter'],
  },
  cod: {
    mockNames: ['COD_Operator', 'GhostMain', 'PriceCaptain', 'MW_Sniper', 'WarzonePro'],
  },
  valorant: {
    mockNames: ['Valorant_Pro', 'JettMain', 'PhoenixPlayer', 'SageHealer', 'RazeExplosive'],
  },
}

export async function lookupNickname(
  gameSlug: string,
  uid: string,
  server?: string
): Promise<string | null> {
  // Simulate network delay (200-800ms)
  await new Promise(resolve => setTimeout(resolve, Math.random() * 600 + 200))

  const config = gameConfigs[gameSlug.toLowerCase()]
  
  // If game not found, return null
  if (!config) {
    console.log(`Game not found: ${gameSlug}`)
    return null
  }

  // For demo: validate that UID is at least 5 digits
  if (!uid || uid.length < 5 || !/^\d+$/.test(uid)) {
    return null
  }

  // For demo: generate a deterministic nickname based on UID
  // In production: call actual game API
  if (config.mockNames) {
    const index = parseInt(uid.slice(-2)) % config.mockNames.length
    return `${config.mockNames[index]}_${uid.slice(-4)}`
  }

  // Default mock nickname
  return `Player_${uid.slice(-6)}`
}

// Function to get game info from slug
export function getGameInfo(slug: string) {
  const games: Record<string, { name: string; requiresServer: boolean }> = {
    mlbb: { name: 'Mobile Legends', requiresServer: true },
    freefire: { name: 'Free Fire', requiresServer: false },
    pubg: { name: 'PUBG Mobile', requiresServer: false },
    genshin: { name: 'Genshin Impact', requiresServer: false },
    cod: { name: 'Call of Duty', requiresServer: false },
    valorant: { name: 'Valorant', requiresServer: false },
  }
  
  return games[slug.toLowerCase()]
}
