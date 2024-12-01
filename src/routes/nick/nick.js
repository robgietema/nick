/**
 * Nick route.
 * @module routes/nick/nick
 */

export const handler = async () => {
  return {
    html: `
<html><body>
<pre><code>
                                          .*@@@@@+.                    :=**+:                                           
                                          +@@%#+=::=#@@@@@@@@@@@@@* *@@@@%#*++++*@@@@#                                      
                                     :*@@#+-::..=#+:.         :-+*+=*%=:-====-=+*+=*@@@@@@::+*+:                            
                                  -@%#+::::::-%=.  .:--+=-===:.  .-=*.=#..-=*+: .----:=**+++@++%%@                          
                                #@*:--.:-.:==..-+++=---::--=+##=-:::-===@#= .:.         :-+**---+@@:                        
                              .%*:::-:--::=-:*=-::::::.:...   ::+*=:.-+*. ..  =%@+:  ..:::...*:...%@*                       
                           #@@=#::::::-.:-:#-::::.   .:======-::. :*+::=   =@*   .%@@@@#=---=+%@:..+@                       
                        #@%=#.+-:::-:-:.===:::.  .-*#=::---==--=+*+==*+= +@=  +@@%==-..:---::..+%+. -@@:                    
                      @%+-.--.+.:::::-.:%-::. -*@%%..--:==+**+=-: .=#+*-=+  @@=  +  --:  .:::..:@@:++=*@@                   
                    -@=-.:.*.-=:::::-:.*: ..:##- :..:=-:...::-:=+:::..-:= :#. .*@=#%@@#*=.. ..-:-@@*-..+@-                  
                  +@+-:-:..#.+::::-:-.-*...+#- . :::=..::--=-=----======@%@@@@@@%#%%%%@@..=+++-:   .++  %@                  
                =@@-:--::.== *.::::--:%..=#+...:--:=.:-:-=:.     .:==..#@***++++++*+***@@+-:.        .@.=%@@@               
              .@#+-.:::.:.*.+:.--:.=-+..+*:..:=+*+:*::---    %%++=.   -@+++***+***+*++#@-  =++*#%%#*+=++ %.:*@@.            
             @@*+#-::-::.-:-::.::.---= ++. .:+*: =.*-:--: .@@@@@@@@@@@@*++++++******+*+*@           .-+@ @-:-.-%@           
            :@++-::=====. .-:::::--.+:++..:=++:=@%*=----.:@@@#**++=+===+++++*++++*******%@@@@@@@@@@@@#*@+%@ ....@           
            %%+::=-=..  :@@#=:.:+=.#:=-. :++=:%+=: #:---.=@@**+++++*++**++++*++**++**+*****##%@@ ...::+*.:*@-:-.+@          
           @*%*..+-.:: @@#*=::-+:.*---..-++===-:-@@@ :==.-#%***++***+++++**++++++++**+****+*#*@- .    @+.:-*%    @*         
          *+ #. -=.-:.#@=....++.*+.-:..-++-:::%@%*+@#:--.:@%++*+**++++++*+++++++*#@@@@@%#***+*@# :-=-:@:.:::%@#%%@@         
         @*..#@+-+.:- +@=..==:+=::-..:++=:.-@@#+++++@.-: =@#***+*+*+++++*+#%@@@@@@*    @@@@@#*#@ .:...#@+=-:%#.:..#.        
         @-.. @@=-: -. :=%%*+:.:-.  =*=:.-@@*+#@@@%@@ .  %@**+*++++++++++*@ @+      =      *@@@@  ::.   @- :@  . ..#@       
         @=.   -+=@:.-.      ...  -+=:.:%@#+++#   @@    @@*+++++*++++++++##    .:. -          *@@@   :...%--#.:..:::+@@     
         @#=:   ..:%- -+.       :=-..=@@#++*++*@@     %@@#*+*+***+**++***#@ ....    :%@@@@@@@@@*#@@@: :*#@@=%%: .==#@+@     
       .@=.@*@:     -+   +**+===++%@@%*++*+++***@@@@@@@*+++++++++++++**++*@:   .@@@@@@@@%%#****+++#@@@+#=    .#@@= #-.@     
        @.+-*@@@@@@@@@@@@#++%@@@@@#*+++*%%#***++++====+++++*++*******++***#@@@@@###@#+-:--+%%*+*****+@.  .-:.    +##:=@     
      @=# *.=        -@*%@@@@#*++*@@@@@@%=@%**+++*+++++++*+++*++++++++++*++***+*%@:  .-==--:-##+*+**#%@.   .-==:.  *@@+@.   
      @=* #....  .%@- @*+++++*@@@@%  .  .  @%++++*******+*++++++****++++*++*+++*#: ..--======-#*+*+*+*@@--++++*#**-*#-:+%@  
      @.= @.  -%@+    -#*+**@@+     ...  .  @*****+++++*+*+++++++*++++*+++++**+%-:.--==========#*******%@@*@@@@#+=.@@+:.=@  
      @%- *=-+:    .-@@***#@@   .-=.        @*+*+*+*+++++++*++*+++++++*++++++++#:---==+=====+==#+*******#@.       @%=+@#@@  
      .@@:+@+-.=#@@@@%#*+#@- .      :=+#@@@@%**+*+++++*=+++++++++++++++++++++++#===++==========#+++++****@# ..:..@@:  .@@   
         @*%@@%@@#:.@@#**@=    *@@@@@@@@%*++**++++***+++**++++++++++++++++++++++*--=-=======-+%*+*+*++***@* .=+ @# .-: *    
        %@+   -.     #@**+  #@@@#%@%%##%%%*+++*+*++**+++++++++++===+++++==+=++++*#+-----====*#++=++*****#@% +*= @ :=-@@@.   
       @*.+:.:-+  :-. #@*@@@@#*%%+-.::..:=##*+++++++*++++++==++++++====++++++=+:+%@@@*+++*##+=+++++******@@ -=: @.:   #@    
      @*..%-+++%@.-::  @*+*++*%*. .---==--=+#++++++++++++==+++===++++++++++=+++++   :+#%#*+=+++++++++*+*+%@ :+- +- .. %@+   
      @::.%@==-.*: ..- +#**++#*=:-===++=====+#=++++++++=+++====++=========++====+#@%#=.   =++==+++*+*****#@ ::--:==.  @@%   
      @@-. *%@: %   :  @#****#==--=+++=+*++*=@=**+++=+=+===+=+=+=%=-=======++=++++===+*##*++++=++++*+***+*@   ..    .%@     
        %@.=  =+%..--*@@+***+#*=+++**++++*+==@-*-*+=++=+=+=====*==*-=======+#@%#=================+++++***#@%*-.:=*#@@@+=    
          @@::-.*@@@@=.@#*+*+*@*==++++++====#**@ #=============+=.#@@@@@%**#=  @%+++++=====+===++++*****##@@+#@@%*#*.-@@    
          @@@@-:       :@+**+++##+======-=+%*+% =#==+=====+++*@@@@@+: ..-#@@-   ++======++==+=++++++***##%%=***=++@@@@:     
          #=-.:  ..: . .@********@@#####%@#+## =%++===+++=+#@@.      .       .: =*=+++++=++++++++*****##@@%%%#+%@@@*        
         -%:-::.:=#*%@@@%*++++*++=++*+*+==+#  ##+===+%@@@@@@   .::.-.        . *%++++=+++++++=******##@@%@@@@@@@@           
         -@.=-*-+#@@#: @@%***+++++++===+=+ -%#+=====+-   =   .-       #%*..=*@@#*+++++++*+++******%@@@@@@@                  
          *@.%@#-.      :@@*++*++++==+===***+=======+%      +- .@@@@@@@@@@@@%*++**+***#+**#*##%@@@@@                        
            #% .#%@#+: .  @@#**++++=+============++++#@=::.  .@@@%@@@=:#@*+++*+**+******#%@@@@@@=                           
            .@@@#+++@@@@+  @@**+++++++++=+++++++++==++#%@@@@@@%**%   :: .###*#*##*%@@@@@@@@.                                
             @#= +++=  .#:  @@%**+++++=+=+==+===+++++++***++*****%=-=  #@###%@@@@@@@.                                       
             .@#-    .-.::-  :@#++*+++++=++++++*+++++*#*******#**#%@@:.@@@@@@@@                                             
               @@@:=%#*#%*-:.  %*****++++++++*++**#*##**#####*#%@@@@@@@@                                                    
                -@@@-       . @@*********+*******++++**++*#*#%#=                                                            
                   #@@%    @@@@@@@%#*#*##########*@@@%@@@#@=@@#@@@@@@@@@@@@@@@@@@@@@@:+  @@                                 
                    -@@%@@@%**. :+@@@@@@@@@@@@@@@%@%#++%%@@@@@*%%@#%*%@@#*#*@@=##%@@@@@@@@@@%                               
                    @@+-=*+=@@+*@@@@@@*        *%%%*#@###**###*%%##@@%@%@@@@%%+###***%+=#+%@@@:                             
                     @@@@@@@@@@@@             @@%###*#+*%#+#**#=--=#+ %=.**-=-=***+=**+*#*#*#@@.                            
                       @@                     @@*====#=-*#=*****%:+%# @+.#* +*+#**++***#====+%@@                            
                                            .@@=#%%@+#++%#*++%++*+=*#:@#.%+:#++#*+.*#--*+*%#%=+@@@                          
                                           %@=****%*++*=%%*=++*+#+ **.@*.#*:*+++*+-#%*-#=+%=***=*@                          
                                          @@#*%%*+==#%%..##:#+%*+=-##-%*-%==#-**++:##-+%*.-+****+@@                         
                                          @%*#*+==.#=*@+*%%#++#*=%+#%:%+=%-***#*==%%%=#@@@@****=++@@                        
                                         @*==*####@@@*@%.+%%+*##+-=-@ @-+#--:**#*+%*:.%* +=+:-=+===@@                       
                                        @%-%@@%#*%#@+*%@-=+%=+##+*+-@ @-*#*#*+*+++@#--@%--*#+=+++*=%@                       
                                      %*%=###==++*#-.@*@-::@%#+#+*+:@.@+##:+*+#*#%@+.@#@#+**#++++**:%@*                     
                                      @@#-#+*:@+@%+#@@*@%******##+*:@:@+#+.%##%**#= .@*@#@=+#%+#.*=@:#@%                    
                                      @+.*-@=+*-@=.%%#@@@:.#@+*##+++%*%*#++*=##**@%=@@@@#*=* % @ @:% =@-                    
                                     %@@-% % %.#.=*### .##%*@@@@%#=**#+#%+=+=@@@@+**** =#%+=-+ + -:++#@                     
                                   @@-@%#**#+#+%*%#+*#@@:.:.   +#*=%@@@@@=**+#- . +.--@@#*#*@**###+**#@                     
                                @@%++-+-:--:-=+**%++*=..=#@#+..:-  ..   .:  ::- +*@@##-+%**%%**+=:--:-@                     
                            +@@@+*+:.#@@@##%%****==+*=.+#- +@@@@=@@*:-..=-#@%.@@@@ ==#.-%##**++**%%*%@@                     
                         .@@*===:.=@%+#===--=:-*#=++ *=-== +=#% .=..@:@*=*==:: %+-= -.*#+**#%#+-+---++@*                    
                          @-*+:=@@*-.+#***==@%-=%:==#+.*-=+#%+ @@%#*+ @-:%*+:@ :*#*%%+- #*+=+*=@@%=+*=@@                    
                          @%=+*+=::-.*%+-+=+%:@*@+-=:#@@%*-.-*- -*=#*:@=-@--.:=*+. =#@@@*=++@@@. @==*-@@                    
                           @==.=-=.. .@*=*==%.------===*.=@@@@@@-.--# : *= -=++@@@%+-:=+#=++@   .@-+*+@%                    
                           +@:::::-.. .#=**=%:-===-:%##++#-=#=.+%%@%%-  #%@@*#**=+-=*-*-**+@%   @@#@+@.                     
                            #@:.. --#%#*@*@@@%:==-.##-#=% :##--+++*--@@@%-=*+*#.-+*==*.%:#*@.   @@@@@@                      
                             =*.:-++#*+::+:. :--:.%#.%:-:=%#*--+**+=*%##+=.%*:+:-=%*:++@-+#@       =                        
                              @@+*##*=====------.#%+#=:+*+#-:::+*#. =*##---#*.+:::**=: -+:=@                                
                               @@%+*+**+-=---==-:@.*==+ ***::-:=**#::=@% :-#*##=--:#+==#*@.#@                               
                                @@*:--=-==-=--=-=@#- =+=*+=:-+=+**= *=@@--:+=*:+=--+*++- -*%@.                              
                                  @@*:.:::-==+=:.%@= *:+=#:::===+** *##* +#+=#.=+:.-++++:#@@:                               
                                    @@@%*++#%@@@@%+%@%#@@@@@@%*+*#- #=-#%==-++*+%@@%###*@@                                  
                                       :@@%@-    @@@@*=:--..-=#%@@%@@@@@@@@@@@@*-::+*=+*@-                                  
                                                    @**+**+**=+=*@@@        @+===+++++++@@                                  
                                                    @%%%%#*+++*+@#          @#++++**##%%@-                                  
                                                    @    .+*++++@           *@+++**::   ==                                  
                                                  @@#-:@*.-*-=*+@%          @@*+-+.:=*=:=@@:                                
                                                 @@-:+=..=:# :+.@@         -@#.--.*- :-*+:=@                                
                                                  #**:=:**@#*###@           #@****#%%+---**@                                
                                                @@@*@***=#**#+=+@.          @%+++##*+=++#@+@@@                              
                                               @#:..:**.=-  *#++#@          @#+*#- .-:-#+..:+@@                             
                                              @@***#*+++**#+ -#*%@          @+*#..+##*+++****#@%                            
                                             @@+====++=++=*+#%@@@@          @@@*#*#+=++===+===%@=                           
                                             @@@@@@@@@@@@@@@@@                 +@@@@@@@@@@@@@@@@-                           
</code></pre>
</body>
</html>`,
  };
};

export default [
  {
    op: 'get',
    view: '/@nick',
    permission: 'View',
    handler,
  },
];