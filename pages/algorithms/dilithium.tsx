import { AlgorithmLayout } from '../../components/layouts/AlgorithmLayout'
import { Card, CardContent } from '../../components/ui/card'

export default function DilithiumPage() {
  return (
    <AlgorithmLayout
      title="Dilithium"
      description="A lattice-based digital signature scheme for post-quantum cryptography"
    >
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Overview</h3>
          <p className="text-gray-300 leading-relaxed">
            Dilithium is a digital signature scheme based on the hardness of lattice problems 
            over module lattices. It provides strong security guarantees against quantum 
            adversaries while maintaining practical efficiency for real-world applications.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium text-purple-400 mb-2">Key Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• EUF-CMA secure signatures</li>
                <li>• Module learning with errors basis</li>
                <li>• Deterministic signature generation</li>
                <li>• Fast verification process</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium text-purple-400 mb-2">Applications</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Blockchain transaction signing</li>
                <li>• Digital certificates</li>
                <li>• Secure message authentication</li>
                <li>• Smart contract validation</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">Implementation Details</h3>
          <div className="bg-gray-900/50 p-6 rounded-lg font-mono text-sm">
            <pre className="text-gray-300">
              <code>{`
# Example Dilithium usage in our blockchain
dilithium = generate_dilithium_keypair()
message = b"Transaction data to sign"
signature = dilithium.sign(message)

# Signature verification
is_valid = dilithium.verify(message, signature)
assert is_valid == True
              `}</code>
            </pre>
          </div>
        </section>
      </div>
    </AlgorithmLayout>
  )
}
