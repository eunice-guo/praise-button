import SwiftUI
import AVFoundation

struct ContentView: View {
    @State private var isAnimating = false
    @State private var audioPlayer: AVAudioPlayer?

    // Audio files
    let phrases = ["phrase1", "phrase2", "phrase3", "phrase4"]

    var body: some View {
        ZStack {
            // Beige background
            Color(red: 245/255, green: 230/255, blue: 211/255)
                .ignoresSafeArea()

            VStack(spacing: 100) {
                // Tagline
                Text("get some positivity!")
                    .font(.custom("Georgia", size: 38))
                    .foregroundColor(Color(red: 139/255, green: 90/255, blue: 60/255).opacity(0.85))
                    .shadow(color: .white.opacity(0.5), radius: 2, x: 1, y: 1)

                // Glassmorphism Button
                Button(action: handleButtonPress) {
                    Circle()
                        .fill(.ultraThinMaterial)
                        .frame(width: 180, height: 180)
                        .overlay(
                            Circle()
                                .stroke(Color.white.opacity(0.5), lineWidth: 2)
                        )
                        .shadow(color: .black.opacity(0.08), radius: 15, x: 0, y: 8)
                        .scaleEffect(isAnimating ? 1.1 : 1.0)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    func handleButtonPress() {
        // 1. Play random audio
        playRandomPhrase()

        // 2. Trigger animation
        withAnimation(.easeInOut(duration: 0.2)) {
            isAnimating = true
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            withAnimation(.easeInOut(duration: 0.2)) {
                isAnimating = false
            }
        }

        // 3. Trigger haptic feedback
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()
    }

    func playRandomPhrase() {
        let randomPhrase = phrases.randomElement() ?? "phrase1"

        guard let url = Bundle.main.url(forResource: randomPhrase, withExtension: "mp3") else {
            print("Audio file not found: \(randomPhrase).mp3")
            return
        }

        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {
            print("Error playing audio: \(error)")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
