const fs = require('fs');
const path = 'Banking_UI/src/pages/SendMoney/SendMoneyPage.jsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/className="transfer-item"/g, 'className="transaction-item"');
content = content.replace(/className="transfer-details"/g, 'className="tx-details"');
content = content.replace(/className="transfer-name"/g, 'className="tx-name"');
content = content.replace(/className="glass-card transfers-list"/g, 'className="glass-card transfers-list transactions-list"');
content = content.replace(/{tx\.receiverName \|\| 'Unknown'}.*?<span className="transfer-meta">.*?<\/span>/s, 
\{tx.receiverName || 'Unknown'} {isRejected && '(Refund)'}</span>
                  <span className="tx-id">
                    {tx.transactionId ? \\\TXN #\\\\ : (tx.time || 'Recent')}
                    {isPending && <span style={{ color: 'var(--accent-warning)', marginLeft: '4px', fontSize: '0.75rem' }}>- Pending Review</span>}
                    {isApproved && <span style={{ color: 'var(--accent-success)', marginLeft: '4px', fontSize: '0.75rem' }}>- Approved (Transferred)</span>}
                    {isRejected && <span style={{ color: 'var(--accent-danger)', marginLeft: '4px', fontSize: '0.75rem' }}>- Rejected</span>}
                  </span>\);
content = content.replace(/\{\(tx\.receiverName \|\| 'U'\)\.charAt\(0\)\}/g, "{tx.receiverName?.charAt(0)?.toUpperCase() || '?'}");

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed SendMoneyPage formatting');
