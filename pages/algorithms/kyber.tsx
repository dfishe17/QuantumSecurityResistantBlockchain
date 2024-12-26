import { AlgorithmLayout } from '../../components/layouts/AlgorithmLayout'
import { Card, CardContent } from '../../components/ui/card'

export default function KyberPage() {
  return (
    <AlgorithmLayout
      title="Kyber KEM"
      description="A lattice-based key encapsulation mechanism resistant to quantum attacks"
    >
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Overview</h3>
          <p className="text-gray-300 leading-relaxed">
            Kyber is a key encapsulation mechanism (KEM) based on the hardness of solving the 
            learning-with-errors (LWE) problem over module lattices. It's designed to be secure 
            against attacks from both classical and quantum computers.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium text-purple-400 mb-2">Key Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• IND-CCA2 secure key encapsulation</li>
                <li>• Based on module learning with errors (MLWE)</li>
                <li>• Efficient implementation</li>
                <li>• Small public key and ciphertext sizes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium text-purple-400 mb-2">Security Properties</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Post-quantum security</li>
                <li>• Forward secrecy</li>
                <li>• Chosen-ciphertext security</li>
                <li>• Resistance to side-channel attacks</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Implementation Details</h3>
          <div className="bg-gray-900/50 p-6 rounded-lg font-mono text-sm">
            <pre className="text-gray-300">
              <code>{`
# Example Kyber KEM usage in our blockchain
kyber = generate_kyber_keypair()
shared_secret, ciphertext = kyber.encapsulate()
decrypted_secret = kyber.decapsulate(ciphertext)

# Verification
assert shared_secret == decrypted_secret
              `}</code>
            </pre>
          </div>
        </section>
      </div>
    </AlgorithmLayout>
  )
}
