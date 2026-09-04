import Foundation
import Vision
import CoreImage

let a = CommandLine.arguments
guard a.count >= 3 else { FileHandle.standardError.write("uso: cutout <entrada> <saida.png>\n".data(using:.utf8)!); exit(1) }
guard let src = CIImage(contentsOf: URL(fileURLWithPath: a[1])) else {
  FileHandle.standardError.write("não consegui ler a imagem\n".data(using:.utf8)!); exit(2)
}
let handler = VNImageRequestHandler(ciImage: src, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()
do { try handler.perform([req]) } catch {
  FileHandle.standardError.write("Vision falhou: \(error)\n".data(using:.utf8)!); exit(3)
}
guard let obs = req.results?.first else {
  FileHandle.standardError.write("nenhum sujeito encontrado\n".data(using:.utf8)!); exit(4)
}
FileHandle.standardError.write("instâncias: \(obs.allInstances.count)\n".data(using:.utf8)!)
do {
  let buf = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: false)
  let out = CIImage(cvPixelBuffer: buf)
  let ctx = CIContext()
  try ctx.writePNGRepresentation(of: out, to: URL(fileURLWithPath: a[2]),
                                 format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
  FileHandle.standardError.write("ok\n".data(using:.utf8)!)
} catch {
  FileHandle.standardError.write("máscara falhou: \(error)\n".data(using:.utf8)!); exit(5)
}
