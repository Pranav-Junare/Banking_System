const fs = require('fs');
const file = 'Banking_UI/src/pages/SendMoney/SendMoneyPage.jsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/className="glass-card transfers-list"/, 'className="glass-card transfers-list transactions-list"');

content = content.replace(/{tx\.receiverName \|\| 'Unknown'}[\s\S]*?<span className="transfer-meta">.*?<\/span>/, 
\{tx.receiverName || 'Unknown'} {isRejected && '(Refund)'}</span>
                  <span className="tx-id">
                    {tx.transactionId ? \\\TXN #\\\\ : (tx.time || 'Recent')}
                    {isPending && <span style={{ color: 'var(--accent-warning)', marginLeft: '4px', fontSize: '0.75rem' }}>- Pending Review</span>}
                    {isApproved && <span style={{ color: 'var(--accent-success)', marginLeft: '4px', fontSize: '0.75rem' }}>- Approved (Transferred)</span>}
                    {isRejected && <span style={{ color: 'var(--accent-danger)', marginLeft: '4px', fontSize: '0.75rem' }}>- Rejected</span>}
                  </span>\);

content = content.replace(/\{\(tx\.receiverName \|\| 'U'\)\.charAt\(0\)\}/g, "{tx.receiverName?.charAt(0)?.toUpperCase() || '?'}");
content = content.replace(/className="transfer-item"/g, 'className="transaction-item"');
content = content.replace(/className="transfer-details"/g, 'className="tx-details"');
content = content.replace(/className="transfer-name"/g, 'className="tx-name"');

fs.writeFileSync(file, content);
console.log('Fixed styles.');
