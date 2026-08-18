// Cyberpunk & Tech Word Dictionaries for Neon Typist

export const WORD_TIERS = {
  cadet: [
    'byte', 'code', 'data', 'ping', 'node', 'link', 'hash', 'port',
    'flux', 'grid', 'root', 'sync', 'core', 'host', 'beam', 'wire',
    'scan', 'chip', 'load', 'boot', 'loop', 'null', 'void', 'unit',
    'baud', 'echo', 'feed', 'gate', 'lock', 'pipe', 'slot', 'user',
    'zero', 'warp', 'zone', 'plug', 'wave', 'nano', 'flow', 'task',
    'dump', 'rack', 'term', 'span', 'mask', 'cell', 'base', 'seek'
  ],
  hacker: [
    'cipher', 'packet', 'matrix', 'daemon', 'kernel', 'vector', 'socket',
    'crypto', 'synapse', 'terminal', 'glitch', 'proxy', 'buffer', 'cache',
    'switch', 'bridge', 'filter', 'sensor', 'neuron', 'plasma', 'binary',
    'module', 'thread', 'signal', 'schema', 'router', 'parser', 'cursor',
    'memory', 'render', 'script', 'system', 'branch', 'commit', 'static',
    'stream', 'lambda', 'uplink', 'portal', 'avatar', 'beacon', 'client',
    'driver', 'engine', 'hybrid', 'lookup', 'patch', 'subnet'
  ],
  overdrive: [
    'cyberdeck', 'encryption', 'overclock', 'firewall', 'algorithm',
    'bandwidth', 'subroutine', 'mainframe', 'nanotech', 'interface',
    'telemetry', 'synthetic', 'backdoor', 'protocol', 'processor',
    'hypervisor', 'biometric', 'blockchain', 'cryptography', 'quantum',
    'defragment', 'executable', 'middleware', 'transceiver', 'repository',
    'asynchronous', 'electromagnetic', 'infrastructure', 'cybernetics',
    'interceptor', 'payload', 'vulnerability', 'distributed', 'multiplexer',
    'troubleshoot', 'synchronize', 'virtualization', 'cybersecurity'
  ]
};

// Word category presets
export const CATEGORIES = {
  ALL: 'all',
  DEV_OPS: 'devops',
  MATRIX: 'matrix',
  CYBERWARE: 'cyberware'
};

export const getRandomWord = (difficulty = 'hacker', activeWords = []) => {
  const activeSet = new Set(activeWords.map(w => w.text.toLowerCase()));
  let pool = [];

  if (difficulty === 'cadet') {
    pool = [...WORD_TIERS.cadet];
  } else if (difficulty === 'overdrive') {
    // Overdrive has a mix of hacker and overdrive
    pool = [...WORD_TIERS.hacker, ...WORD_TIERS.overdrive];
  } else {
    // Hacker has cadet & hacker
    pool = [...WORD_TIERS.cadet, ...WORD_TIERS.hacker];
  }

  // Filter out words currently active to prevent duplicates on screen
  const available = pool.filter(w => !activeSet.has(w.toLowerCase()));
  const candidatePool = available.length > 0 ? available : pool;

  const randomIndex = Math.floor(Math.random() * candidatePool.length);
  const selectedText = candidatePool[randomIndex];

  // Determine tier & base score based on word length
  let points = 100;
  let tier = 'tier-1';
  if (selectedText.length > 8) {
    points = 350;
    tier = 'tier-3';
  } else if (selectedText.length > 5) {
    points = 200;
    tier = 'tier-2';
  }

  return {
    id: `word_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    text: selectedText,
    points,
    tier,
    length: selectedText.length
  };
};
