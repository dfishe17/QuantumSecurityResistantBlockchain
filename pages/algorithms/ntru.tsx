import { AlgorithmLayout } from '../../components/layouts/AlgorithmLayout'
import { Card, CardContent } from '../../components/ui/card'

export default function NTRUPage() {
  return (
    <AlgorithmLayout
      title="NTRU"
      description="A lattice-based public key cryptosystem for secure communication"
    >
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Overview</h3>
          <p className="text-gray-300 leading-relaxed">
            NTRU (Nth Degree TRUncated Polynomial Ring Units) is one of the earliest and most 
            well-studied lattice-based cryptosystems. It offers efficient encryption and 
            decryption operations while maintaining strong security against quantum attacks.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium text-purple-400 mb-2">Advantages</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Fast encryption/decryption</li>
                <li>• Compact key sizes</li>
                <li>• Patent-free implementation</li>
                <li>• Mathematical foundations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium text-purple-400 mb-2">Parameters</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Polynomial degree (N)</li>
                <li>• Modulus (q)</li>
                <li>• Small modulus (p)</li>
                <li>• Security level selection</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Implementation Example</h3>
          <div className="bg-gray-900/50 p-6 rounded-lg font-mono text-sm">
            <pre className="text-gray-300">
              <code>{`
# Example NTRU usage in our blockchain
ntru = generate_ntru_keypair()
message = b"Secret message"[:32]  # NTRU has message length limit
ciphertext = ntru.encrypt(message)

# Decrypt the message
decrypted = ntru.decrypt(ciphertext)
assert message == decrypted
              `}</code>
            </pre>
          </div>
        </section>
      </div>
    </AlgorithmLayout>
  )
}
